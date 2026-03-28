"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import {
  Bot, Send, Paperclip, RotateCcw, Sparkles,
  BookOpen, TrendingUp, Package, Truck, Upload, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { icon: TrendingUp,  text: "¿Cuál es mi margen de utilidad este mes y cómo mejorarlo?",       category: "Finanzas" },
  { icon: Package,     text: "Analiza el estado de mi inventario y recomienda acciones",          category: "Operaciones" },
  { icon: Truck,       text: "¿Cómo puedo reducir mis costos de logística?",                     category: "Logística" },
  { icon: BookOpen,    text: "¿Cuáles son mis principales riesgos financieros actuales?",         category: "Finanzas" },
  { icon: TrendingUp,  text: "Genera un análisis FODA de mi negocio con los datos actuales",     category: "Estrategia" },
  { icon: Package,     text: "¿Qué proveedores debo priorizar para reabastecimiento?",           category: "Operaciones" },
];

const CAPABILITIES = [
  { icon: "📊", title: "Análisis Financiero",   desc: "P&L, flujo de caja, indicadores, proyecciones" },
  { icon: "📦", title: "Gestión Operativa",     desc: "Inventario, pedidos, proveedores, KPIs" },
  { icon: "🚚", title: "Optimización Logística",desc: "Rutas, costos de envío, trazabilidad" },
  { icon: "📁", title: "Análisis de Archivos",  desc: "Excel, CSV, exports de SIIGO, SAP, Oracle" },
  { icon: "🎯", title: "Recomendaciones",       desc: "Estrategias accionables basadas en tus datos" },
  { icon: "📈", title: "Proyecciones",          desc: "Forecasting financiero y de demanda" },
];

export default function AsistentePage() {
  const [messages, setMessages] = useState<Message[]>([{
    id: "0", role: "assistant", timestamp: new Date(),
    content: "¡Hola! Soy tu asistente empresarial con inteligencia artificial de nivel experto.\n\nTengo acceso a todos tus datos de finanzas, operaciones y logística. Puedo analizar archivos de tu ERP (SIIGO, SAP, Oracle, Excel) y darte recomendaciones basadas en las mejores prácticas empresariales.\n\n**¿En qué te puedo ayudar hoy?**",
  }]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [fileCtx, setFileCtx] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })), fileContext: fileCtx }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { id: Date.now() + "_a", role: "assistant", content: data.response || "Lo siento, ocurrió un error.", timestamp: new Date() }]);
    } catch {
      setMessages((p) => [...p, { id: Date.now() + "_e", role: "assistant", content: "Error de conexión. Verifica tu API key e intenta de nuevo.", timestamp: new Date() }]);
    } finally { setLoading(false); }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    setLoading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      setFileCtx(data.summary);
      setFileName(file.name);
      setMessages((p) => [...p, {
        id: Date.now() + "_f", role: "assistant",
        content: `He procesado el archivo **${file.name}** exitosamente.\n\n${data.summary ? "Resumen del contenido:\n\n" + data.summary + "\n\n¿Qué análisis deseas realizar?" : "Puedes preguntarme sobre su contenido."}`,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages((p) => [...p, { id: Date.now() + "_fe", role: "assistant", content: "Error al procesar el archivo. Asegúrate de que sea .xlsx, .xls o .csv.", timestamp: new Date() }]);
    } finally { setLoading(false); }
  }

  const fmt = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  const isWelcome = messages.length === 1;

  return (
    <div className="flex flex-col h-full page-enter">
      <Header title="Asistente IA" subtitle="Experto en finanzas, operaciones y logística empresarial" />

      <div className="flex flex-1 overflow-hidden">
        {/* Capabilities sidebar — only on welcome */}
        {isWelcome && (
          <div
            className="w-72 flex-shrink-0 overflow-y-auto p-5"
            style={{ background: "#fff", borderRight: "1px solid #F0F0F0" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} style={{ color: "#0066CC" }} />
              <p className="text-[12px] font-semibold text-[#1D1D1F]">Capacidades</p>
            </div>
            <div className="space-y-2">
              {CAPABILITIES.map((cap) => (
                <div key={cap.title} className="p-3 rounded-[10px]" style={{ background: "#F5F5F7" }}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[15px]">{cap.icon}</span>
                    <p className="text-[12px] font-semibold text-[#1D1D1F]">{cap.title}</p>
                  </div>
                  <p className="text-[11px] text-[#6E6E73]">{cap.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => fileRef.current?.click()}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-[10px] text-[13px] font-medium text-white btn-press transition-all"
              style={{ background: "#0066CC" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0077ED")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0066CC")}
            >
              <Upload size={14} />
              Importar archivo
            </button>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#F5F5F7" }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3 message-enter", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg,#0066CC,#5AC8FA)" }}>
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className="max-w-[70%] px-5 py-4 text-[14px] leading-relaxed"
                  style={{
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user" ? "#0066CC" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#1D1D1F",
                    boxShadow: msg.role === "assistant" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  }}
                  dangerouslySetInnerHTML={{ __html: fmt(msg.content) }}
                />
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 message-enter">
                <div className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#0066CC,#5AC8FA)" }}>
                  <Bot size={16} className="text-white" />
                </div>
                <div className="px-5 py-4 rounded-[18px] rounded-tl-[4px] bg-white shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    {[0,1,2].map((i) => <div key={i} className={`w-2 h-2 rounded-full typing-dot`} style={{ background: "#AEAEB2" }} />)}
                  </div>
                </div>
              </div>
            )}

            {/* Suggested questions on welcome */}
            {isWelcome && !loading && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => send(q.text)}
                    className="flex items-start gap-3 p-4 text-left rounded-[14px] bg-white transition-all group"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid transparent" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#0066CC";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                    }}
                  >
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ background: "#F0F4FF" }}>
                      <q.icon size={15} style={{ color: "#0066CC" }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#0066CC" }}>{q.category}</p>
                      <p className="text-[12px] text-[#3D3D3D] leading-snug">{q.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-8 py-5 bg-white" style={{ borderTop: "1px solid #F0F0F0" }}>
            {fileName && (
              <div className="mb-3 px-4 py-2 rounded-[10px] flex items-center justify-between" style={{ background: "#F0FBF4" }}>
                <div className="flex items-center gap-2">
                  <Paperclip size={12} style={{ color: "#1A8A3C" }} />
                  <p className="text-[12px] font-medium" style={{ color: "#1A8A3C" }}>Activo: {fileName}</p>
                </div>
                <button onClick={() => { setFileCtx(null); setFileName(null); }} style={{ color: "#AEAEB2" }}>
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex items-end gap-3">
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
              <button onClick={() => fileRef.current?.click()}
                className="w-10 h-10 flex items-center justify-center rounded-[10px] flex-shrink-0 transition-colors"
                style={{ background: "#F5F5F7", color: "#6E6E73" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#E8E8ED")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#F5F5F7")}
              >
                <Paperclip size={16} />
              </button>
              <button onClick={() => { setMessages([{ id: "0", role: "assistant", content: "Conversación reiniciada. ¿En qué te ayudo?", timestamp: new Date() }]); setFileCtx(null); setFileName(null); }}
                className="w-10 h-10 flex items-center justify-center rounded-[10px] flex-shrink-0 transition-colors"
                style={{ background: "#F5F5F7", color: "#6E6E73" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#E8E8ED")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#F5F5F7")}
              >
                <RotateCcw size={15} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Escribe tu pregunta o análisis que necesitas..."
                rows={1}
                className="flex-1 px-4 py-3 text-[14px] outline-none resize-none transition-all"
                style={{
                  background: "#F5F5F7", borderRadius: 10, border: "1px solid transparent",
                  color: "#1D1D1F", maxHeight: 120, lineHeight: 1.5,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.border = "1px solid #0066CC";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = "#F5F5F7";
                  e.currentTarget.style.border = "1px solid transparent";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 flex items-center justify-center rounded-[10px] flex-shrink-0 text-white transition-all btn-press"
                style={{ background: "#0066CC" }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0077ED"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0066CC"; }}
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[11px] text-center mt-2" style={{ color: "#AEAEB2" }}>
              Acepta .xlsx · .xls · .csv · SIIGO · SAP · Oracle · Enter para enviar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
