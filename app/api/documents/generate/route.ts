import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import ExcelJS from "exceljs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { type, format, context, companyName, period } = await request.json();

    const docTypes: Record<string, string> = {
      financial_statement: "Estado de Resultados",
      portfolio_report: "Informe de Cartera",
      budget_projection: "Proyección de Presupuesto",
      assembly_minutes: "Acta de Asamblea",
      resident_notice: "Comunicado a Residentes/Clientes",
    };

    const docTitle = docTypes[type] || type;

    // Generate content with Claude
    let content = "";
    if (process.env.ANTHROPIC_API_KEY) {
      const prompt = `Genera un documento profesional de tipo "${docTitle}" para la empresa "${companyName || "PYME Demo S.A.S"}".

Período: ${period || "Junio 2024"}
Contexto adicional: ${JSON.stringify(context || {})}

El documento debe:
1. Tener formato profesional con secciones claras
2. Incluir datos relevantes y análisis
3. Estar en español colombiano formal
4. Ser apropiado para presentar a directivos o clientes
5. Incluir conclusiones y recomendaciones cuando aplique

Formato de respuesta: texto estructurado con secciones marcadas con ## para títulos`;

      const response = await client.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });
      content = response.content[0].type === "text" ? response.content[0].text : "";
    } else {
      content = `## ${docTitle}\n\n**Empresa:** ${companyName || "PYME Demo S.A.S"}\n**Período:** ${period || "Junio 2024"}\n\nEste es un documento de demostración. Configure ANTHROPIC_API_KEY para generar documentos con IA.`;
    }

    if (format === "excel") {
      // Generate Excel file
      const workbook = new ExcelJS.Workbook();
      workbook.creator = companyName || "PYME.ai";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet(docTitle.substring(0, 31));

      // Header styling
      const headerFill: ExcelJS.Fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0071E3" },
      };
      const headerFont: Partial<ExcelJS.Font> = { color: { argb: "FFFFFFFF" }, bold: true, size: 12 };

      // Company header
      worksheet.mergeCells("A1:F1");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = companyName || "PYME.ai";
      titleCell.font = { bold: true, size: 16, color: { argb: "FF0071E3" } };
      titleCell.alignment = { horizontal: "center" };

      worksheet.mergeCells("A2:F2");
      const subtitleCell = worksheet.getCell("A2");
      subtitleCell.value = `${docTitle} — ${period || "Junio 2024"}`;
      subtitleCell.font = { bold: true, size: 13 };
      subtitleCell.alignment = { horizontal: "center" };

      worksheet.addRow([]);

      // Parse and add content sections
      const sections = content.split("\n").filter((line) => line.trim());
      let rowIndex = 4;

      for (const line of sections) {
        const row = worksheet.addRow([]);
        if (line.startsWith("## ")) {
          const cell = worksheet.getCell(`A${rowIndex}`);
          cell.value = line.replace("## ", "");
          cell.font = headerFont;
          cell.fill = headerFill;
          worksheet.mergeCells(`A${rowIndex}:F${rowIndex}`);
        } else if (line.startsWith("**") && line.endsWith("**")) {
          const cell = worksheet.getCell(`A${rowIndex}`);
          cell.value = line.replace(/\*\*/g, "");
          cell.font = { bold: true };
        } else {
          const cell = worksheet.getCell(`A${rowIndex}`);
          cell.value = line.replace(/\*\*(.*?)\*\*/g, "$1");
        }
        worksheet.getColumn("A").width = 80;
        rowIndex++;
        void row;
      }

      // Footer
      worksheet.addRow([]);
      rowIndex++;
      const footerCell = worksheet.getCell(`A${rowIndex}`);
      footerCell.value = `Generado por PYME.ai — ${new Date().toLocaleDateString("es-CO")}`;
      footerCell.font = { italic: true, color: { argb: "FF6E6E73" }, size: 10 };

      const buffer = await workbook.xlsx.writeBuffer();

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${docTitle.replace(/\s/g, "_")}_${period || "2024"}.xlsx"`,
        },
      });
    }

    // Default: return JSON with content (PDF is generated client-side)
    return NextResponse.json({
      success: true,
      title: docTitle,
      content,
      period: period || "Junio 2024",
      company: companyName || "PYME Demo S.A.S",
      generatedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Document generation error:", error);
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
