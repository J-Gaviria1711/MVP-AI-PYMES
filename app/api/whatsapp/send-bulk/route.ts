import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = 10; // max messages per second

function applyTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `{{${key}}}`);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const { recipients, template, baseVars } = await request.json();
    // recipients: Array<{ phone: string; vars: Record<string, string> }>

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ success: false, error: "No hay destinatarios" }, { status: 400 });
    }

    const results: Array<{
      phone: string;
      sid: string;
      status: string;
      error?: string;
    }> = [];

    const isDemoMode = !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN;

    let client: ReturnType<typeof require> | null = null;
    if (!isDemoMode) {
      const twilio = require("twilio");
      client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const vars = { ...baseVars, ...recipient.vars };
      const message = applyTemplate(template, vars);

      if (isDemoMode) {
        results.push({
          phone: recipient.phone,
          sid: "SM" + Math.random().toString(36).substr(2, 32),
          status: Math.random() > 0.1 ? "queued" : "failed",
        });
      } else {
        try {
          const result = await client!.messages.create({
            body: message,
            from: process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886",
            to: `whatsapp:${recipient.phone}`,
          });
          results.push({ phone: recipient.phone, sid: result.sid, status: result.status });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : "Error desconocido";
          results.push({ phone: recipient.phone, sid: "", status: "failed", error: errMsg });
        }
      }

      // Rate limiting: pause every RATE_LIMIT messages
      if ((i + 1) % RATE_LIMIT === 0 && i + 1 < recipients.length) {
        await sleep(1000);
      }
    }

    const sent = results.filter((r) => r.status !== "failed").length;
    const failed = results.filter((r) => r.status === "failed").length;

    return NextResponse.json({
      success: true,
      total: recipients.length,
      sent,
      failed,
      results,
      demo: isDemoMode,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
