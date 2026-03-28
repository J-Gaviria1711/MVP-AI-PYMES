import { NextRequest, NextResponse } from "next/server";

// Vercel Cron Job: runs every day at 9am
// vercel.json: { "crons": [{ "path": "/api/cron/reminders-30", "schedule": "0 14 * * *" }] }

export async function GET(request: NextRequest) {
  // Validate cron secret to prevent unauthorized calls
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const log = {
      jobId: "reminders-30",
      name: "Recordatorios 30+ días de mora",
      startedAt: now.toISOString(),
      status: "running",
    };

    // In production: query database for overdue accounts > 30 days
    // Then call /api/whatsapp/send-bulk for each batch
    // For demo: simulate the process
    const mockOverdueAccounts = [
      { unit: "101", resident: "Carlos Martínez", phone: "+573001234567", daysOverdue: 45, amount: 320000 },
      { unit: "203", resident: "Ana López", phone: "+573009876543", daysOverdue: 38, amount: 320000 },
      { unit: "305", resident: "Pedro Gómez", phone: "+573005555555", daysOverdue: 31, amount: 640000 },
    ];

    const template = "Estimado(a) {{nombre}}, le recordamos que su cuota de administración del mes de {{mes}} por valor de ${{valor}} se encuentra pendiente de pago ({{dias}} días de mora). Por favor realice su pago a la brevedad. Mayor información: 📞 {{telefono_admin}}";

    const results = [];
    for (const account of mockOverdueAccounts) {
      // In production: actually call Twilio here
      results.push({
        unit: account.unit,
        resident: account.resident,
        phone: account.phone,
        status: "sent",
        message: template
          .replace("{{nombre}}", account.resident)
          .replace("{{mes}}", now.toLocaleDateString("es-CO", { month: "long", year: "numeric" }))
          .replace("{{valor}}", account.amount.toLocaleString("es-CO"))
          .replace("{{dias}}", account.daysOverdue.toString())
          .replace("{{telefono_admin}}", "311 000 0000"),
      });
    }

    return NextResponse.json({
      ...log,
      status: "completed",
      completedAt: new Date().toISOString(),
      processed: results.length,
      results,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    console.error("Cron reminders-30 error:", msg);
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}
