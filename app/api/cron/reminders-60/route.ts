import { NextRequest, NextResponse } from "next/server";

// Vercel Cron Job: runs every day at 9am (60+ days overdue - urgent tone)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const mockOverdueAccounts = [
      { unit: "102", resident: "Luis Torres", phone: "+573001111111", daysOverdue: 72, amount: 960000 },
      { unit: "401", resident: "María Sánchez", phone: "+573002222222", daysOverdue: 65, amount: 640000 },
    ];

    const template = "⚠️ AVISO IMPORTANTE — {{nombre}}: Su deuda de administración asciende a ${{valor}} con {{dias}} días de mora. Le informamos que se procederá con el proceso de cobro jurídico si no regulariza su situación en los próximos 5 días hábiles. Comuníquese con la administración.";

    const results = mockOverdueAccounts.map((account) => ({
      unit: account.unit,
      resident: account.resident,
      phone: account.phone,
      status: "sent",
      message: template
        .replace("{{nombre}}", account.resident)
        .replace("{{valor}}", account.amount.toLocaleString("es-CO"))
        .replace("{{dias}}", account.daysOverdue.toString()),
    }));

    return NextResponse.json({
      jobId: "reminders-60",
      name: "Recordatorios urgentes 60+ días",
      startedAt: now.toISOString(),
      completedAt: new Date().toISOString(),
      status: "completed",
      processed: results.length,
      results,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}
