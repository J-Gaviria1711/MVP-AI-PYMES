import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { to, message, template, templateVars } = await request.json();

    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      // Demo mode: simulate sending
      return NextResponse.json({
        success: true,
        sid: "SM" + Math.random().toString(36).substr(2, 32),
        status: "queued",
        to,
        message: templateVars ? applyTemplate(template, templateVars) : message,
        demo: true,
      });
    }

    const twilio = require("twilio");
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const finalMessage = templateVars
      ? applyTemplate(template, templateVars)
      : message;

    const result = await client.messages.create({
      body: finalMessage,
      from: process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886",
      to: `whatsapp:${to}`,
    });

    return NextResponse.json({
      success: true,
      sid: result.sid,
      status: result.status,
      to,
      message: finalMessage,
    });
  } catch (error: unknown) {
    console.error("WhatsApp send error:", error);
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { success: false, error: `Error al enviar mensaje: ${msg}` },
      { status: 200 }
    );
  }
}

function applyTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `{{${key}}}`);
}
