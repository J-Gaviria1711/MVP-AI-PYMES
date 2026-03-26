import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let summary = "";

    if (
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".csv")
    ) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheets: string[] = [];

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];

        if (data.length > 0) {
          const headers = data[0] as string[];
          const rows = data.slice(1, 6); // first 5 data rows

          sheets.push(
            `**Hoja: ${sheetName}**\n` +
              `Columnas: ${headers.join(", ")}\n` +
              `Total filas: ${data.length - 1}\n` +
              `Primeras filas:\n${rows
                .map((row) => (row as unknown[]).join(" | "))
                .join("\n")}`
          );
        }
      });

      summary = sheets.join("\n\n");
    } else {
      summary = `Archivo recibido: ${file.name} (${(file.size / 1024).toFixed(1)} KB). Formato no completamente compatible, pero puedes preguntar sobre su contenido.`;
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      summary,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error al procesar el archivo" },
      { status: 500 }
    );
  }
}
