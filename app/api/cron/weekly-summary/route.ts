import { NextRequest, NextResponse } from "next/server";

// Vercel Cron Job: runs every Monday at 9am
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // In production: query DB for weekly portfolio summary
    const summary = {
      totalResidents: 120,
      paidThisWeek: 18,
      overdueAccounts: 23,
      totalOverdue: 7360000,
      newPayments: 5760000,
      collectionRate: "76%",
    };

    const message = `📊 RESUMEN SEMANAL — ${now.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}

💰 Recaudado esta semana: $${summary.newPayments.toLocaleString("es-CO")}
✅ Pagos recibidos: ${summary.paidThisWeek} unidades
⚠️ Cuentas en mora: ${summary.overdueAccounts} unidades
🔴 Total cartera vencida: $${summary.totalOverdue.toLocaleString("es-CO")}
📈 Índice de recaudo: ${summary.collectionRate}

Ingrese al panel para ver el detalle completo.`;

    return NextResponse.json({
      jobId: "weekly-summary",
      name: "Resumen semanal de cartera",
      startedAt: now.toISOString(),
      completedAt: new Date().toISOString(),
      status: "completed",
      summary,
      messageSent: message,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}
