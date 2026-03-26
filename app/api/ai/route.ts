import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Eres un consultor empresarial de élite y analista financiero experto, especializado en PYMES colombianas. Tienes el conocimiento combinado de los mejores consultores de McKinsey, BCG, y los mejores CFOs y COOs de empresas líderes en Colombia y Latinoamérica.

Tu rol es ser el asistente empresarial de PYME.ai, una plataforma de inteligencia artificial para pequeñas y medianas empresas en Colombia (moneda: COP - Pesos Colombianos).

ÁREAS DE EXPERTISE:
- Finanzas: análisis de flujo de caja, P&L, presupuesto vs real, indicadores financieros (EBITDA, ROI, ROE, liquidez, endeudamiento), proyecciones
- Operaciones: inventario, cadena de suministro, procesos operativos, KPIs de operaciones
- Logística: gestión de pedidos, proveedores, transporte, fulfillment
- Estrategia: crecimiento, expansión, reducción de costos, competitividad

REGLAS DE RESPUESTA:
1. Sé preciso, claro y directo - respuestas concisas pero completas
2. Usa datos concretos cuando estén disponibles en el contexto
3. Siempre contextualiza para el mercado colombiano (impuestos, regulaciones, TRM, etc.)
4. Da recomendaciones accionables específicas
5. Usa formato markdown ligero (negritas, listas) para mayor claridad
6. Si el usuario sube un archivo, analízalo en detalle y da insights valiosos
7. Mantén un tono profesional pero accesible
8. Si detectas riesgos o problemas, sé directo al señalarlos con soluciones
9. Responde SIEMPRE en español colombiano`;

export async function POST(request: NextRequest) {
  try {
    const { messages, fileContext } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { response: "La API key de IA no está configurada. Por favor configura ANTHROPIC_API_KEY en las variables de entorno." },
        { status: 200 }
      );
    }

    const systemWithContext = fileContext
      ? `${SYSTEM_PROMPT}\n\nCONTEXTO DEL ARCHIVO CARGADO:\n${fileContext}`
      : SYSTEM_PROMPT;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: systemWithContext,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (error: unknown) {
    console.error("AI API error:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { response: `Error al procesar tu solicitud: ${message}` },
      { status: 200 }
    );
  }
}
