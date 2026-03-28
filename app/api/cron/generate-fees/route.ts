import { NextRequest, NextResponse } from "next/server";

// Vercel Cron Job: runs every 1st of the month at 12am
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const monthName = now.toLocaleDateString("es-CO", { month: "long", year: "numeric" });

    // In production: query all active residents from DB and create fee records
    const mockResidents = [
      { unit: "101", resident: "Carlos Martínez", amount: 320000 },
      { unit: "102", resident: "Luis Torres", amount: 320000 },
      { unit: "203", resident: "Ana López", amount: 320000 },
    ];

    const feesGenerated = mockResidents.map((r) => ({
      ...r,
      month: monthName,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 10).toLocaleDateString("es-CO"),
      status: "pending",
      id: `FEE-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${r.unit}`,
    }));

    return NextResponse.json({
      jobId: "generate-fees",
      name: "Generación automática de cuotas mensuales",
      startedAt: now.toISOString(),
      completedAt: new Date().toISOString(),
      status: "completed",
      month: monthName,
      feesGenerated: feesGenerated.length,
      totalAmount: feesGenerated.reduce((s, f) => s + f.amount, 0),
      fees: feesGenerated,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}
