import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import * as XLSX from "xlsx";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Detect bank format based on column headers
function detectBankFormat(headers: string[]): string {
  const h = headers.map((s) => s?.toString().toLowerCase() || "");
  if (h.some((x) => x.includes("bancolombia"))) return "Bancolombia";
  if (h.some((x) => x.includes("davivienda"))) return "Davivienda";
  if (h.some((x) => x.includes("bogotá") || x.includes("bogota"))) return "Banco de Bogotá";
  if (h.some((x) => x.includes("fecha") && x.includes("descripción"))) return "Genérico";
  return "Desconocido";
}

// Normalize transaction rows from different bank formats
function normalizeTransactions(rows: Record<string, string>[], bank: string) {
  return rows
    .filter((row) => {
      const vals = Object.values(row);
      return vals.some((v) => v && String(v).trim() !== "");
    })
    .map((row, i) => {
      const keys = Object.keys(row);
      // Try common column name patterns
      const dateKey = keys.find((k) =>
        /fecha|date/i.test(k)
      ) || keys[0];
      const descKey = keys.find((k) =>
        /descripci|concepto|detail|narrat/i.test(k)
      ) || keys[1];
      const amountKey = keys.find((k) =>
        /valor|monto|amount|cr[eé]dito|débito|debit/i.test(k)
      ) || keys[2];
      const refKey = keys.find((k) =>
        /referencia|ref|nro|n[uú]mero/i.test(k)
      );

      return {
        id: `TXN-${i + 1}`,
        date: row[dateKey] || "",
        description: row[descKey] || "",
        amount: parseFloat(String(row[amountKey] || "0").replace(/[^0-9.-]/g, "")) || 0,
        reference: refKey ? row[refKey] || "" : "",
        raw: row,
      };
    })
    .filter((t) => t.amount !== 0);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const portfolioJson = formData.get("portfolio") as string;

    if (!file) {
      return NextResponse.json({ success: false, error: "No se recibió archivo" }, { status: 400 });
    }

    // Parse file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "El archivo está vacío o no tiene datos válidos" }, { status: 400 });
    }

    const headers = Object.keys(rows[0]);
    const bankName = detectBankFormat(headers);
    const transactions = normalizeTransactions(rows, bankName);

    // Portfolio context (pending receivables)
    const portfolio = portfolioJson ? JSON.parse(portfolioJson) : [];

    if (!process.env.ANTHROPIC_API_KEY) {
      // Demo mode: simulate reconciliation
      const reconciled = transactions.slice(0, Math.floor(transactions.length * 0.7)).map((t) => ({
        ...t,
        status: "reconciled" as const,
        confidence: Math.floor(Math.random() * 20) + 80,
        matchedTo: portfolio[0] || { unit: "Unidad 101", resident: "Juan García", amount: t.amount },
        notes: "Identificado automáticamente",
      }));
      const pending = transactions.slice(Math.floor(transactions.length * 0.7)).map((t) => ({
        ...t,
        status: (Math.random() > 0.5 ? "unidentified" : "review") as "unidentified" | "review",
        confidence: Math.floor(Math.random() * 30) + 40,
        notes: "Requiere revisión manual",
      }));

      return NextResponse.json({
        success: true,
        bank: bankName,
        totalTransactions: transactions.length,
        results: [...reconciled, ...pending],
        summary: {
          reconciled: reconciled.length,
          unidentified: pending.filter((p) => p.status === "unidentified").length,
          review: pending.filter((p) => p.status === "review").length,
          totalAmount: transactions.reduce((s, t) => s + t.amount, 0),
        },
        demo: true,
      });
    }

    // Call Claude for analysis
    const prompt = `Eres un experto en conciliación bancaria para empresas colombianas.

EXTRACTO BANCARIO (${bankName}):
${JSON.stringify(transactions.slice(0, 50), null, 2)}

CARTERA PENDIENTE (pagos esperados):
${JSON.stringify(portfolio.slice(0, 20), null, 2)}

Tu tarea:
1. Cruza cada transacción del extracto contra la cartera pendiente
2. Para cada transacción indica:
   - status: "reconciled" (identificada con >80% confianza), "review" (50-80% confianza), "unidentified" (<50%)
   - confidence: número 0-100
   - matchedTo: la unidad/residente/factura que corresponde (si encontraste match)
   - notes: explicación breve

IMPORTANTE: Si la confianza es menor al 80%, marca como "review" o "unidentified", NO como reconciled.

Responde SOLO con JSON válido con esta estructura:
{
  "results": [
    {
      "id": "TXN-1",
      "status": "reconciled|review|unidentified",
      "confidence": 85,
      "matchedTo": { "unit": "...", "resident": "...", "amount": 0 },
      "notes": "..."
    }
  ],
  "summary": {
    "reconciled": 0,
    "review": 0,
    "unidentified": 0,
    "totalAmount": 0
  }
}`;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No se pudo parsear la respuesta de IA");
    }
    const aiResult = JSON.parse(jsonMatch[0]);

    // Merge AI results with transaction data
    const enrichedResults = transactions.map((t) => {
      const aiData = aiResult.results?.find((r: { id: string }) => r.id === t.id);
      return { ...t, ...(aiData || { status: "unidentified", confidence: 0, notes: "No procesado" }) };
    });

    return NextResponse.json({
      success: true,
      bank: bankName,
      totalTransactions: transactions.length,
      results: enrichedResults,
      summary: aiResult.summary || {
        reconciled: enrichedResults.filter((r) => r.status === "reconciled").length,
        review: enrichedResults.filter((r) => r.status === "review").length,
        unidentified: enrichedResults.filter((r) => r.status === "unidentified").length,
        totalAmount: transactions.reduce((s, t) => s + t.amount, 0),
      },
    });
  } catch (error: unknown) {
    console.error("Bank reconciliation error:", error);
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
