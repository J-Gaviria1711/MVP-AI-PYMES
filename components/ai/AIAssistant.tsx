"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Paperclip, Sparkles, ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "¿Cuál es mi margen de utilidad?",
  "¿Qué productos tienen bajo stock?",
  "Analiza mis gastos del trimestre",
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: "0", role: "assistant", timestamp: new Date(),
    content: "¡Hola! Soy tu asistente empresarial IA. Puedo analizar tus finanzas, operaciones y logística. ¿En qué te ayudo?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileContext, setFileContext] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })), fileContext }),
      });
      const data = await res.json();
      setMessages((p) => [...p, { id: Date.now() + "_a", role: "assistant", content: data.response || "Error al procesar.", timestamp: new Date() }]);
    } catch {
      setMessages((p) => [...p, { id: Date.now() + "_e", role: "assistant", content: "Error de conexión. Intenta de nuevo.", timestamp: new Date() }]);
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
      setFileContext(data.summary);
      setMessages((p) => [...p, { id: Date.now() + "_f", role: "assistant", content: `Archivo **${file.name}** procesado. ¿Qué análisis necesitas?`, timestamp: new Date() }]);
    } catch {
      setMessages((p) => [...p, { id: Date.now() + "_fe", role: "assistant", content: "Error al procesar el archivo.", timestamp: new Date() }]);
    } finally { setLoading(false); }
  }

  const fmt = (t: string) => t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-13 h-13 flex items-center justify-center rounded-[14px] text-white shadow-lg z-50 btn-press transition-all"
          style={{ background: "#0066CC", width: 52, height: 52, boxShadow: "0 4px 16px rgba(0,102,204,0.4)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0077ED")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#0066CC")}
        >
          <Sparkles size={20} />
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-6 right-6 flex flex-col z-50 modal-enter overflow-hidden"
          style={{
            width: 400, height: 580, background: "#fff",
            borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.16),0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#0066CC,#5AC8FA)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white leading-tight">Asistente IA</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                  <p className="text-[11px] text-white/80">Experto Empresarial</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setMessages([{ id: "0", role: "assistant", content: "Nueva conversación. ¿En qué te ayudo?", timestamp: new Date() }]); setFileContext(null); }}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.15)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
              >
                <RotateCcw size={13} className="text-white" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.15)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
              >
                <ChevronDown size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: "#F5F5F7" }}>
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-2 message-enter", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg,#0066CC,#5AC8FA)" }}>
                    <Bot size={12} className="text-white" />
                  </div>
                )}
                <div
                  className="max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed"
                  style={{
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background: msg.role === "user" ? "#0066CC" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#1D1D1F",
                    boxShadow: msg.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  }}
                  dangerouslySetInnerHTML={{ __html: fmt(msg.content) }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 message-enter">
                <div className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#0066CC,#5AC8FA)" }}>
                  <Bot size={12} className="text-white" />
                </div>
                <div className="px-3.5 py-3 rounded-[14px] rounded-tl-[4px] bg-white shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0,1,2].map((i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full typing-dot`}
                        style={{ background: "#AEAEB2" }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div className="pt-2 flex flex-col gap-2">
                {SUGGESTIONS.map((q) => (
                  <button key={q} onClick={() => send(q)}
                    className="text-left text-[12px] px-3 py-2 rounded-[10px] transition-colors font-medium"
                    style={{ background: "#F0F4FF", color: "#0066CC" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#E4EDFF")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#F0F4FF")}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-4 py-3 bg-white" style={{ borderTop: "1px solid #F0F0F0" }}>
            {fileContext && (
              <div className="mb-2 px-3 py-1.5 rounded-[8px] flex items-center justify-between"
                style={{ background: "#F0FBF4" }}>
                <p className="text-[11px] font-medium" style={{ color: "#1A8A3C" }}>Archivo procesado activo</p>
                <button onClick={() => setFileContext(null)} style={{ color: "#AEAEB2" }}>
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
              <button onClick={() => fileRef.current?.click()}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] flex-shrink-0 transition-colors"
                style={{ background: "#F5F5F7", color: "#6E6E73" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#E8E8ED")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#F5F5F7")}
              >
                <Paperclip size={14} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Escribe tu pregunta..."
                rows={1}
                className="flex-1 px-3.5 py-2 text-[13px] outline-none transition-all resize-none"
                style={{
                  background: "#F5F5F7", borderRadius: 8, border: "1px solid transparent",
                  color: "#1D1D1F", maxHeight: 80, lineHeight: 1.5,
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
                className="w-8 h-8 flex items-center justify-center rounded-[8px] flex-shrink-0 text-white transition-all btn-press"
                style={{ background: "#0066CC" }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0077ED"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0066CC"; }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
