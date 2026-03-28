"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  FileText,
  Download,
  Sparkles,
  Clock,
  FileSpreadsheet,
  Loader2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DOC_TYPES = [
  {
    id: "financial_statement",
    name: "Estado de Resultados",
    icon: "📊",
    desc: "P&L completo del período seleccionado",
  },
  {
    id: "portfolio_report",
    name: "Informe de Cartera",
    icon: "💰",
    desc: "Ranking de deudores y estado de cuentas",
  },
  {
    id: "budget_projection",
    name: "Proyección de Presupuesto",
    icon: "📈",
    desc: "Presupuesto sugerido basado en historial",
  },
  {
    id: "assembly_minutes",
    name: "Acta de Asamblea",
    icon: "📋",
    desc: "Acta con puntos financieros del período",
  },
  {
    id: "resident_notice",
    name: "Comunicado",
    icon: "📢",
    desc: "Comunicado oficial a clientes/residentes",
  },
];

interface GeneratedDoc {
  id: string;
  title: string;
  type: string;
  period: string;
  generatedAt: string;
  content?: string;
}

export default function DocumentosPage() {
  const [selectedType, setSelectedType] = useState(DOC_TYPES[0].id);
  const [period, setPeriod] = useState("Junio 2024");
  const [companyName, setCompanyName] = useState("Distribuidora El Progreso S.A.S");
  const [customContext, setCustomContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedDoc[]>([]);
  const [previewDoc, setPreviewDoc] = useState<GeneratedDoc | null>(null);

  async function generateDocument(format: "json" | "excel") {
    setLoading(true);
    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          format,
          period,
          companyName,
          context: customContext ? { notes: customContext } : {},
        }),
      });

      if (format === "excel") {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const docType = DOC_TYPES.find((d) => d.id === selectedType);
        a.href = url;
        a.download = `${docType?.name || "documento"}_${period}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);

        // Add to history
        const doc: GeneratedDoc = {
          id: Date.now().toString(),
          title: docType?.name || selectedType,
          type: selectedType,
          period,
          generatedAt: new Date().toLocaleString("es-CO"),
        };
        setHistory((prev) => [doc, ...prev]);
      } else {
        const data = await res.json();
        if (!data.success) {
          alert("Error: " + data.error);
          return;
        }
        const doc: GeneratedDoc = {
          id: Date.now().toString(),
          title: data.title,
          type: selectedType,
          period: data.period,
          generatedAt: new Date().toLocaleString("es-CO"),
          content: data.content,
        };
        setHistory((prev) => [doc, ...prev]);
        setPreviewDoc(doc);
      }
    } catch (error) {
      console.error(error);
      alert("Error al generar el documento. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadDocPDF(doc: GeneratedDoc) {
    if (!doc.content) return;
    // Generate PDF client-side using browser print
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${doc.title}</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1D1D1F; }
    h1 { color: #0071E3; border-bottom: 2px solid #0071E3; padding-bottom: 10px; }
    h2 { color: #1D1D1F; margin-top: 24px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 32px; }
    .company { font-size: 20px; font-weight: bold; color: #0071E3; }
    .meta { font-size: 13px; color: #6E6E73; }
    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #E8E8ED; font-size: 11px; color: #6E6E73; text-align: center; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">${companyName}</div>
    <div class="meta">Período: ${doc.period}<br>Generado: ${doc.generatedAt}</div>
  </div>
  ${doc.content
    .split("\n")
    .map((line) => {
      if (line.startsWith("## ")) return `<h2>${line.replace("## ", "")}</h2>`;
      if (line.startsWith("# ")) return `<h1>${line.replace("# ", "")}</h1>`;
      if (line.trim() === "") return "<br>";
      return `<p>${line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
    })
    .join("")}
  <div class="footer">Generado por PYME.ai — ${new Date().toLocaleDateString("es-CO")}</div>
</body>
</html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }

  const selectedDocType = DOC_TYPES.find((d) => d.id === selectedType);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Generación de Documentos"
        subtitle="Crea documentos profesionales con IA en segundos"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
          {/* Config panel */}
          <div className="col-span-2 space-y-5">
            {/* Document type */}
            <div className="bg-white rounded-2xl border border-[#E8E8ED] p-5">
              <h3 className="text-[14px] font-semibold text-[#1D1D1F] mb-4">Tipo de documento</h3>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {DOC_TYPES.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedType(doc.id)}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                      selectedType === doc.id
                        ? "border-[#0071E3] bg-[#E8F1FC]"
                        : "border-[#E8E8ED] hover:border-[#AEAEB2]"
                    )}
                  >
                    <span className="text-[20px]">{doc.icon}</span>
                    <div>
                      <p className="text-[12px] font-semibold text-[#1D1D1F]">{doc.name}</p>
                      <p className="text-[11px] text-[#6E6E73] mt-0.5">{doc.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#6E6E73] mb-1 block">Empresa</label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] bg-[#F5F5F7] border border-[#E8E8ED] rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#6E6E73] mb-1 block">Período</label>
                  <input
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="Ej: Junio 2024, Q2 2024"
                    className="w-full px-3 py-2 text-[13px] bg-[#F5F5F7] border border-[#E8E8ED] rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-[11px] text-[#6E6E73] mb-1 block">
                  Contexto adicional (opcional)
                </label>
                <textarea
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder="Ej: incluir análisis de variación vs presupuesto, destacar los 3 mayores deudores..."
                  rows={3}
                  className="w-full px-3 py-2 text-[13px] bg-[#F5F5F7] border border-[#E8E8ED] rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 resize-none"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => generateDocument("json")}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0071E3] text-white rounded-xl text-[14px] font-semibold hover:bg-[#0077ED] disabled:opacity-40 transition-all"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                Generar con IA (Vista previa)
              </button>
              <button
                onClick={() => generateDocument("excel")}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#34C759] text-white rounded-xl text-[14px] font-semibold hover:bg-[#2DB84D] disabled:opacity-40 transition-all"
              >
                <FileSpreadsheet size={16} />
                Exportar Excel
              </button>
            </div>
          </div>

          {/* Right: History */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-[#E8E8ED] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} className="text-[#6E6E73]" />
                <h3 className="text-[14px] font-semibold text-[#1D1D1F]">
                  Historial ({history.length})
                </h3>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={32} className="text-[#AEAEB2] mx-auto mb-2" />
                  <p className="text-[12px] text-[#6E6E73]">
                    Los documentos generados aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-[#F9F9FB] rounded-xl border border-[#F0F0F5]"
                    >
                      <p className="text-[12px] font-semibold text-[#1D1D1F]">{doc.title}</p>
                      <p className="text-[11px] text-[#6E6E73] mt-0.5">{doc.period}</p>
                      <p className="text-[10px] text-[#AEAEB2] mt-0.5">{doc.generatedAt}</p>
                      <div className="flex gap-2 mt-2">
                        {doc.content && (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="flex items-center gap-1 text-[11px] text-[#0071E3] font-medium hover:underline"
                          >
                            <Eye size={11} />
                            Ver
                          </button>
                        )}
                        {doc.content && (
                          <button
                            onClick={() => downloadDocPDF(doc)}
                            className="flex items-center gap-1 text-[11px] text-[#0071E3] font-medium hover:underline"
                          >
                            <Download size={11} />
                            PDF
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected doc info */}
            <div className="bg-gradient-to-br from-[#0071E3] to-[#5AC8FA] rounded-2xl p-5 text-white">
              <span className="text-[28px]">{selectedDocType?.icon}</span>
              <p className="text-[14px] font-semibold mt-2">{selectedDocType?.name}</p>
              <p className="text-[12px] opacity-80 mt-1">{selectedDocType?.desc}</p>
              <div className="mt-3 p-2 bg-white/20 rounded-lg">
                <p className="text-[11px] opacity-90">
                  Generado por Claude (Anthropic) con datos contextuales de tu empresa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview modal */}
        {previewDoc && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-[#E8E8ED]">
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1D1D1F]">{previewDoc.title}</h3>
                  <p className="text-[12px] text-[#6E6E73]">{previewDoc.period}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadDocPDF(previewDoc)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0071E3] text-white text-[12px] font-medium rounded-xl"
                  >
                    <Download size={13} />
                    Exportar PDF
                  </button>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="px-4 py-2 bg-[#F5F5F7] text-[#6E6E73] text-[12px] font-medium rounded-xl hover:bg-[#E8E8ED]"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className="prose prose-sm max-w-none">
                  {previewDoc.content?.split("\n").map((line, i) => {
                    if (line.startsWith("## "))
                      return (
                        <h2 key={i} className="text-[15px] font-bold text-[#1D1D1F] mt-5 mb-2">
                          {line.replace("## ", "")}
                        </h2>
                      );
                    if (line.trim() === "") return <br key={i} />;
                    return (
                      <p
                        key={i}
                        className="text-[13px] text-[#3D3D3D] leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
