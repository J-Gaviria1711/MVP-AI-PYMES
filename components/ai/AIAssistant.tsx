"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Paperclip,
  Sparkles,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "¿Cuál es mi margen de utilidad este mes?",
  "¿Qué productos tienen bajo stock?",
  "Analiza mis gastos del último trimestre",
  "¿Cuáles son mis principales riesgos financieros?",
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Hola! Soy tu asistente de IA especializado en análisis empresarial. Puedo ayudarte a entender tus finanzas, operaciones y logística con análisis de nivel experto. ¿En qué te puedo ayudar hoy?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
          content: "Error de conexión. Verifica tu conexión e intenta de nuevo.",
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

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadedFile(data.summary);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_file",
          role: "assistant",
          content: `He procesado el archivo **${file.name}**. ${data.summary ? "Aquí hay un resumen:\n\n" + data.summary : "Puedes preguntarme sobre su contenido."}`,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_ferr",
          role: "assistant",
          content: "Error al procesar el archivo. Asegúrate de que sea un formato válido (Excel, CSV).",
          timestamp: new Date(),
        },
      ]);
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

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#0071E3] rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(0,113,227,0.4)] hover:bg-[#0077ED] hover:scale-105 transition-all duration-200 z-50"
        >
          <Sparkles size={22} className="text-white" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[#E8E8ED] flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0071E3] to-[#5AC8FA] px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white">Asistente IA</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#34C759] rounded-full" />
                  <p className="text-[11px] text-white/80">Experto Empresarial</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: "0",
                      role: "assistant",
                      content: "Conversación reiniciada. ¿En qué te puedo ayudar?",
                      timestamp: new Date(),
                    },
                  ])
                }
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Nueva conversación"
              >
                <RotateCcw size={14} className="text-white" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronDown size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#F9F9FB]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2 message-enter",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 bg-gradient-to-br from-[#0071E3] to-[#5AC8FA] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={13} className="text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[78%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed",
                    msg.role === "user"
                      ? "bg-[#0071E3] text-white rounded-tr-sm"
                      : "bg-white text-[#1D1D1F] rounded-tl-sm shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#F0F0F5]"
                  )}
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                />
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 justify-start message-enter">
                <div className="w-7 h-7 bg-gradient-to-br from-[#0071E3] to-[#5AC8FA] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bot size={13} className="text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#F0F0F5]">
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-[#AEAEB2] rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-[#AEAEB2] rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-[#AEAEB2] rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions (shown only at start) */}
          {messages.length === 1 && (
            <div className="px-4 py-3 bg-[#F9F9FB] border-t border-[#F0F0F5] flex gap-2 flex-wrap">
              {SUGGESTED_QUESTIONS.slice(0, 2).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] px-3 py-1.5 bg-[#E8F1FC] text-[#0071E3] rounded-xl hover:bg-[#D4E8FC] transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-4 bg-white border-t border-[#E8E8ED] flex-shrink-0">
            {uploadedFile && (
              <div className="mb-2 px-3 py-1.5 bg-[#E8F8ED] rounded-xl flex items-center justify-between">
                <p className="text-[11px] text-[#1A8A3C] font-medium">
                  Archivo procesado activo
                </p>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-[#1A8A3C] hover:text-[#CC2929]"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 bg-[#F5F5F7] rounded-xl flex items-center justify-center hover:bg-[#E8E8ED] transition-colors flex-shrink-0"
                title="Adjuntar archivo"
              >
                <Paperclip size={15} className="text-[#6E6E73]" />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                rows={1}
                className="flex-1 bg-[#F5F5F7] rounded-xl px-4 py-2.5 text-[13px] text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20 resize-none transition-all"
                style={{ maxHeight: "100px" }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-[#0071E3] rounded-xl flex items-center justify-center hover:bg-[#0077ED] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
              >
                <Send size={15} className="text-white" />
              </button>
            </div>
            <p className="text-[10px] text-[#AEAEB2] text-center mt-2">
              Acepta Excel, CSV, SIIGO, SAP exports
            </p>
          </div>
        </div>
      )}
    </>
  );
}
