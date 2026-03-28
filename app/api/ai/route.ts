export const runtime = "edge";

import Anthropic from "@anthropic-ai/sdk";

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
        response: "La API key de IA no está configurada. Por favor configura ANTHROPIC_API_KEY en las variables de entorno de Vercel.",
      });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const system = fileContext
      ? `${SYSTEM_PROMPT}\n\nCONTEXTO DEL ARCHIVO CARGADO:\n${fileContext}`
      : SYSTEM_PROMPT;

    // Streaming response — no timeout on Edge runtime
    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ text: chunk.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
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
