"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import {
  Bot,
  Send,
  Paperclip,
  RotateCcw,
  Sparkles,
  BookOpen,
  TrendingUp,
  Package,
  Truck,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  { icon: TrendingUp, text: "¿Cuál es mi margen de utilidad este mes y cómo mejorarlo?", category: "Finanzas" },
  { icon: Package, text: "Analiza el estado de mi inventario y recomienda acciones", category: "Operaciones" },
  { icon: Truck, text: "¿Cómo puedo reducir mis costos de logística?", category: "Logística" },
  { icon: BookOpen, text: "¿Cuáles son mis principales riesgos financieros actuales?", category: "Finanzas" },
  { icon: TrendingUp, text: "Genera un análisis FODA de mi negocio con los datos actuales", category: "Estrategia" },
  { icon: Package, text: "¿Qué proveedores debo priorizar para reabastecimiento?", category: "Operaciones" },
];

const CAPABILITIES = [
  { icon: "📊", title: "Análisis Financiero", desc: "P&L, flujo de caja, indicadores, proyecciones" },
  { icon: "📦", title: "Gestión Operativa", desc: "Inventario, pedidos, proveedores, KPIs" },
  { icon: "🚚", title: "Optimización Logística", desc: "Rutas, costos de envío, trazabilidad" },
  { icon: "📁", title: "Análisis de Archivos", desc: "Excel, CSV, exports de SIIGO, SAP, Oracle" },
  { icon: "🎯", title: "Recomendaciones", desc: "Estrategias accionables basadas en tus datos" },
  { icon: "📈", title: "Proyecciones", desc: "Forecasting financiero y de demanda" },
];

export default function AsistentePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: "¡Hola! Soy tu asistente empresarial con inteligencia artificial de nivel experto. Tengo acceso completo a todos tus datos de finanzas, operaciones y logística.\n\n**¿Qué puedo hacer por ti hoy?**\n\nPuedo analizar tus estados financieros, identificar oportunidades de mejora, detectar riesgos, analizar archivos de tu ERP (SIIGO, SAP, Oracle, Excel) y darte recomendaciones basadas en las mejores prácticas empresariales.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          fileContext: uploadedFile,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_ai",
          role: "assistant",
          content: data.response || "Lo siento, ocurrió un error. Intenta de nuevo.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_err",
          role: "assistant",
          content: "Error de conexión. Verifica tu API key e intenta de nuevo.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadedFile(data.summary);
      setUploadedFileName(file.name);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_file",
          role: "assistant",
          content: `He procesado el archivo **${file.name}** exitosamente. ${data.summary ? "\n\nResumen del contenido:\n\n" + data.summary + "\n\n¿Qué análisis deseas que realice sobre este archivo?" : "Puedes preguntarme sobre su contenido."}`,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_ferr",
          role: "assistant",
          content: "Error al procesar el archivo. Asegúrate de que sea .xlsx, .xls o .csv.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  const showWelcome = messages.length === 1;

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Asistente IA"
        subtitle="Experto en finanzas, operaciones y logística empresarial"
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Capabilities (shown on welcome) */}
        {showWelcome && (
          <div className="w-72 border-r border-[#E8E8ED] bg-white p-6 overflow-y-auto flex-shrink-0">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={16} className="text-[#0071E3]" />
              <p className="text-[13px] font-semibold text-[#1D1D1F]">Capacidades</p>
            </div>
            <div className="space-y-3">
              {CAPABILITIES.map((cap) => (
                <div key={cap.title} className="p-3 bg-[#F9F9FB] rounded-xl border border-[#F0F0F5]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[16px]">{cap.icon}</span>
                    <p className="text-[12px] font-semibold text-[#1D1D1F]">{cap.title}</p>
                  </div>
                  <p className="text-[11px] text-[#6E6E73]">{cap.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 bg-gradient-to-br from-[#0071E3] to-[#5AC8FA] rounded-xl text-white">
              <p className="text-[12px] font-semibold mb-1">Importar datos</p>
              <p className="text-[11px] opacity-80 mb-3">
                Sube tu archivo de SIIGO, SAP, Oracle o Excel para análisis instantáneo
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-[12px] font-medium px-3 py-2 rounded-lg w-full justify-center transition-colors"
              >
                <Upload size={13} />
                Subir archivo
              </button>
            </div>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F9F9FB]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 message-enter",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-9 h-9 bg-gradient-to-br from-[#0071E3] to-[#5AC8FA] rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[70%] px-5 py-4 rounded-2xl text-[14px] leading-relaxed shadow-sm",
                    msg.role === "user"
                      ? "bg-[#0071E3] text-white rounded-tr-sm"
                      : "bg-white text-[#1D1D1F] rounded-tl-sm border border-[#F0F0F5]"
                  )}
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                />
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 justify-start message-enter">
                <div className="w-9 h-9 bg-gradient-to-br from-[#0071E3] to-[#5AC8FA] rounded-2xl flex items-center justify-center shadow-sm">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-[#F0F0F5]">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-[#AEAEB2] rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-[#AEAEB2] rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-[#AEAEB2] rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {/* Suggested questions (welcome state) */}
            {showWelcome && !loading && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => sendMessage(q.text)}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#F0F0F5] hover:border-[#0071E3] hover:shadow-md text-left transition-all group"
                  >
                    <div className="w-8 h-8 bg-[#E8F1FC] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#0071E3] transition-colors">
                      <q.icon size={15} className="text-[#0071E3] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#0071E3] mb-0.5">{q.category}</p>
                      <p className="text-[12px] text-[#3D3D3D] leading-tight">{q.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="bg-white border-t border-[#E8E8ED] px-8 py-5">
            {uploadedFileName && (
              <div className="mb-3 px-4 py-2 bg-[#E8F8ED] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip size={12} className="text-[#1A8A3C]" />
                  <p className="text-[12px] text-[#1A8A3C] font-medium">
                    Archivo activo: {uploadedFileName}
                  </p>
                </div>
                <button
                  onClick={() => { setUploadedFile(null); setUploadedFileName(null); }}
                  className="text-[#6E6E73] hover:text-[#CC2929] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex items-end gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 bg-[#F5F5F7] rounded-xl flex items-center justify-center hover:bg-[#E8E8ED] transition-colors flex-shrink-0"
                title="Adjuntar archivo (Excel, CSV)"
              >
                <Paperclip size={16} className="text-[#6E6E73]" />
              </button>

              <button
                onClick={() => {
                  setMessages([{
                    id: "0",
                    role: "assistant",
                    content: "Conversación reiniciada. ¿En qué te puedo ayudar?",
                    timestamp: new Date(),
                  }]);
                  setUploadedFile(null);
                  setUploadedFileName(null);
                }}
                className="w-10 h-10 bg-[#F5F5F7] rounded-xl flex items-center justify-center hover:bg-[#E8E8ED] transition-colors flex-shrink-0"
                title="Nueva conversación"
              >
                <RotateCcw size={15} className="text-[#6E6E73]" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta o análisis que necesitas..."
                rows={1}
                className="flex-1 bg-[#F5F5F7] rounded-xl px-5 py-3 text-[14px] text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 resize-none transition-all"
                style={{ maxHeight: "120px" }}
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-[#0071E3] rounded-xl flex items-center justify-center hover:bg-[#0077ED] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-sm"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
            <p className="text-[11px] text-[#AEAEB2] mt-2 text-center">
              Acepta archivos: .xlsx · .xls · .csv · Exports de SIIGO, SAP, Oracle · Enter para enviar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
