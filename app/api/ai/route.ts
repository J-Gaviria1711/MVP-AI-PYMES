export const runtime = "edge";

const SYSTEM_PROMPT = `Eres un consultor empresarial de élite y analista financiero experto, especializado en PYMES colombianas. Tienes el conocimiento combinado de los mejores consultores de McKinsey, BCG, y los mejores CFOs y COOs de empresas líderes en Colombia y Latinoamérica.

Tu rol es ser el asistente empresarial de PYME.ai, una plataforma de inteligencia artificial para pequeñas y medianas empresas en Colombia (moneda: COP - Pesos Colombianos).

ÁREAS DE EXPERTISE:
- Finanzas: análisis de flujo de caja, P&L, presupuesto vs real, indicadores financieros (EBITDA, ROI, ROE, liquidez, endeudamiento), proyecciones
- Operaciones: inventario, cadena de suministro, procesos operativos, KPIs de operaciones
- Logística: gestión de pedidos, proveedores, transporte, fulfillment
- Estrategia: crecimiento, expansión, reducción de costos, competitividad

REGLAS DE RESPUESTA:
1. Sé preciso, claro y directo — respuestas concisas pero completas
2. Usa datos concretos cuando estén disponibles en el contexto
3. Siempre contextualiza para el mercado colombiano (impuestos, regulaciones, TRM, etc.)
4. Da recomendaciones accionables específicas
5. Usa formato markdown ligero (negritas, listas) para mayor claridad
6. Si el usuario sube un archivo, analízalo en detalle y da insights valiosos
7. Mantén un tono profesional pero accesible
8. Si detectas riesgos o problemas, sé directo al señalarlos con soluciones
9. Responde SIEMPRE en español colombiano`;

export async function POST(request: Request) {
  try {
    const { messages, fileContext } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({
        response:
          "La API key de IA no está configurada. Por favor configura ANTHROPIC_API_KEY en las variables de entorno de Vercel.",
      });
    }

    const system = fileContext
      ? `${SYSTEM_PROMPT}\n\nCONTEXTO DEL ARCHIVO CARGADO:\n${fileContext}`
      : SYSTEM_PROMPT;

    // Use raw fetch — avoids any Node.js SDK incompatibilities with Vercel Edge
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        stream: true,
        system,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return Response.json(
        { response: `Error de la API: ${anthropicRes.status} — ${err}` },
        { status: 200 }
      );
    }

    // Pipe the Anthropic SSE stream → our SSE response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = anthropicRes.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Sin stream" })}\n\n`)
          );
          controller.close();
          return;
        }
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              const raw = line.slice(6).trim();
              if (raw === "[DONE]") continue;
              try {
                const event = JSON.parse(raw);
                // Anthropic SSE events
                if (
                  event.type === "content_block_delta" &&
                  event.delta?.type === "text_delta"
                ) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
                    )
                  );
                } else if (event.type === "message_stop") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                } else if (event.type === "error") {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ error: event.error?.message ?? "Error" })}\n\n`
                    )
                  );
                }
              } catch {
                // skip malformed lines
              }
            }
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return Response.json({ response: `Error: ${message}` }, { status: 200 });
  }
}
