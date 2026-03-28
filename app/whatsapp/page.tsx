"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  MessageSquare,
  Send,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  {
    id: "cuota",
    name: "Recordatorio de cuota",
    message:
      "Estimado(a) {{nombre}}, le recordamos que su cuota del mes de {{mes}} por valor de ${{valor}} se encuentra pendiente. Por favor realice su pago a la brevedad.",
    vars: ["nombre", "mes", "valor"],
  },
  {
    id: "asamblea",
    name: "Aviso de asamblea",
    message:
      "Estimado(a) {{nombre}}, le informamos que la asamblea de {{tipo}} se realizará el {{fecha}} a las {{hora}} en {{lugar}}. Su asistencia es muy importante.",
    vars: ["nombre", "tipo", "fecha", "hora", "lugar"],
  },
  {
    id: "comunicado",
    name: "Comunicado general",
    message:
      "Estimado(a) {{nombre}}, le informamos: {{mensaje}}. Para mayor información comuníquese con nosotros.",
    vars: ["nombre", "mensaje"],
  },
  {
    id: "pago",
    name: "Confirmación de pago",
    message:
      "Estimado(a) {{nombre}}, confirmamos la recepción de su pago por ${{valor}} correspondiente a {{concepto}}. ¡Gracias!",
    vars: ["nombre", "valor", "concepto"],
  },
];

const MOCK_RECIPIENTS = [
  { id: "1", name: "Carlos Martínez", phone: "+573001234567", unit: "101", status: "moroso", days: 45 },
  { id: "2", name: "Ana López", phone: "+573009876543", unit: "203", status: "moroso", days: 38 },
  { id: "3", name: "Pedro Gómez", phone: "+573005555555", unit: "305", status: "moroso", days: 31 },
  { id: "4", name: "María Sánchez", phone: "+573002222222", unit: "401", status: "al_dia", days: 0 },
  { id: "5", name: "Luis Torres", phone: "+573001111111", unit: "102", status: "moroso", days: 72 },
];

interface MessageLog {
  id: string;
  recipient: string;
  phone: string;
  template: string;
  status: "sent" | "delivered" | "failed" | "pending";
  timestamp: string;
  sid?: string;
}

type RecipientFilter = "all" | "moroso" | "specific";
type TemplateId = string;

export default function WhatsAppPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(TEMPLATES[0].id);
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>("moroso");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [templateVars, setTemplateVars] = useState<Record<string, string>>({
    mes: new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" }),
    valor: "320.000",
    fecha: "",
    hora: "7:00 PM",
    lugar: "Salón comunal",
    tipo: "ordinaria",
    concepto: "cuota de administración",
    mensaje: "",
  });
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<typeof TEMPLATES>([]);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", message: "" });

  const template = [...TEMPLATES, ...customTemplates].find((t) => t.id === selectedTemplate);

  const activeRecipients =
    recipientFilter === "all"
      ? MOCK_RECIPIENTS
      : recipientFilter === "moroso"
      ? MOCK_RECIPIENTS.filter((r) => r.status === "moroso")
      : MOCK_RECIPIENTS.filter((r) => selectedRecipients.includes(r.id));

  const finalMessage = template
    ? template.message.replace(/\{\{(\w+)\}\}/g, (_, key) => templateVars[key] || `{{${key}}}`)
    : customMessage;

  async function handleSend() {
    if (!activeRecipients.length) return;
    setSending(true);

    const recipients = activeRecipients.map((r) => ({
      phone: r.phone,
      vars: { nombre: r.name, ...templateVars },
    }));

    try {
      const res = await fetch("/api/whatsapp/send-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          template: template?.message || customMessage,
          baseVars: templateVars,
        }),
      });
      const data = await res.json();

      const newLogs: MessageLog[] = (data.results || []).map(
        (r: { phone: string; sid: string; status: string }) => ({
          id: r.sid || Math.random().toString(36),
          recipient: activeRecipients.find((a) => a.phone === r.phone)?.name || r.phone,
          phone: r.phone,
          template: template?.name || "Personalizado",
          status: r.status === "failed" ? "failed" : "sent",
          timestamp: new Date().toLocaleString("es-CO"),
          sid: r.sid,
        })
      );
      setLogs((prev) => [...newLogs, ...prev]);
      setShowLogs(true);
    } catch {
      alert("Error al enviar mensajes. Verifica la configuración de Twilio.");
    } finally {
      setSending(false);
    }
  }

  function addCustomTemplate() {
    if (!newTemplate.name || !newTemplate.message) return;
    setCustomTemplates((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: newTemplate.name,
        message: newTemplate.message,
        vars: Array.from(newTemplate.message.matchAll(/\{\{(\w+)\}\}/g)).map((m) => m[1]),
      },
    ]);
    setNewTemplate({ name: "", message: "" });
    setShowNewTemplate(false);
  }

  const statusIcon = (status: string) => {
    if (status === "sent" || status === "delivered")
      return <CheckCircle size={14} className="text-green-500" />;
    if (status === "failed") return <XCircle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-yellow-500" />;
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="WhatsApp Empresarial"
        subtitle="Envío masivo y automatizado de mensajes a clientes"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
          {/* Left: Config */}
          <div className="col-span-2 space-y-5">
            {/* Template selector */}
            <div className="bg-white rounded-2xl border border-[#E8E8ED] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-[#1D1D1F]">Plantilla de mensaje</h3>
                <button
                  onClick={() => setShowNewTemplate(!showNewTemplate)}
                  className="flex items-center gap-1.5 text-[12px] text-[#0071E3] font-medium hover:underline"
                >
                  <Plus size={14} />
                  Nueva plantilla
                </button>
              </div>

              {showNewTemplate && (
                <div className="mb-4 p-4 bg-[#F5F5F7] rounded-xl space-y-3">
                  <input
                    placeholder="Nombre de la plantilla"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 text-[13px] bg-white border border-[#E8E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20"
                  />
                  <textarea
                    placeholder="Mensaje (usa {{variable}} para campos dinámicos)"
                    value={newTemplate.message}
                    onChange={(e) => setNewTemplate((p) => ({ ...p, message: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 text-[13px] bg-white border border-[#E8E8ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addCustomTemplate}
                      className="px-4 py-1.5 bg-[#0071E3] text-white text-[12px] font-medium rounded-lg hover:bg-[#0077ED]"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setShowNewTemplate(false)}
                      className="px-4 py-1.5 bg-[#F5F5F7] text-[#6E6E73] text-[12px] font-medium rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[...TEMPLATES, ...customTemplates].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                      selectedTemplate === t.id
                        ? "border-[#0071E3] bg-[#E8F1FC]"
                        : "border-[#E8E8ED] hover:border-[#AEAEB2]"
                    )}
                  >
                    <div>
                      <p className="text-[12px] font-semibold text-[#1D1D1F]">{t.name}</p>
                      <p className="text-[11px] text-[#6E6E73] mt-0.5">{t.vars.length} variables</p>
                    </div>
                    {t.id.startsWith("custom-") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomTemplates((prev) => prev.filter((x) => x.id !== t.id));
                        }}
                        className="text-[#AEAEB2] hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </button>
                ))}
              </div>

              {/* Template variables */}
              {template && template.vars.length > 0 && (
                <div>
                  <p className="text-[12px] font-semibold text-[#1D1D1F] mb-2">Variables del mensaje</p>
                  <div className="grid grid-cols-2 gap-2">
                    {template.vars
                      .filter((v) => !["nombre"].includes(v))
                      .map((v) => (
                        <div key={v}>
                          <label className="text-[11px] text-[#6E6E73] mb-1 block capitalize">
                            {v}
                          </label>
                          <input
                            value={templateVars[v] || ""}
                            onChange={(e) =>
                              setTemplateVars((p) => ({ ...p, [v]: e.target.value }))
                            }
                            className="w-full px-3 py-2 text-[12px] bg-[#F5F5F7] border border-[#E8E8ED] rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0071E3]/20"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recipients */}
            <div className="bg-white rounded-2xl border border-[#E8E8ED] p-5">
              <h3 className="text-[14px] font-semibold text-[#1D1D1F] mb-4">Destinatarios</h3>
              <div className="flex gap-2 mb-4">
                {(["all", "moroso", "specific"] as RecipientFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setRecipientFilter(f)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[12px] font-medium transition-all",
                      recipientFilter === f
                        ? "bg-[#0071E3] text-white"
                        : "bg-[#F5F5F7] text-[#6E6E73] hover:bg-[#E8E8ED]"
                    )}
                  >
                    {f === "all" ? "Todos" : f === "moroso" ? "Morosos" : "Específicos"}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {MOCK_RECIPIENTS.filter((r) =>
                  recipientFilter === "moroso" ? r.status === "moroso" : true
                ).map((r) => (
                  <div
                    key={r.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border",
                      recipientFilter === "specific"
                        ? selectedRecipients.includes(r.id)
                          ? "border-[#0071E3] bg-[#E8F1FC]"
                          : "border-[#E8E8ED]"
                        : "border-[#E8E8ED] bg-[#F9F9FB]"
                    )}
                    onClick={() => {
                      if (recipientFilter === "specific") {
                        setSelectedRecipients((prev) =>
                          prev.includes(r.id) ? prev.filter((x) => x !== r.id) : [...prev, r.id]
                        );
                      }
                    }}
                    style={{ cursor: recipientFilter === "specific" ? "pointer" : "default" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#0071E3] to-[#5AC8FA] rounded-xl flex items-center justify-center">
                        <span className="text-[11px] font-bold text-white">{r.unit}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#1D1D1F]">{r.name}</p>
                        <p className="text-[11px] text-[#6E6E73]">{r.phone}</p>
                      </div>
                    </div>
                    {r.status === "moroso" && (
                      <span className="text-[11px] px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium">
                        {r.days} días
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Preview + Stats */}
          <div className="space-y-5">
            {/* Preview */}
            <div className="bg-white rounded-2xl border border-[#E8E8ED] p-5">
              <h3 className="text-[14px] font-semibold text-[#1D1D1F] mb-4">Vista previa</h3>
              <div className="bg-[#E8F8ED] rounded-xl p-3 mb-4">
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <p className="text-[12px] text-[#1D1D1F] leading-relaxed whitespace-pre-wrap">
                    {finalMessage.replace("{{nombre}}", "Nombre del Cliente")}
                  </p>
                  <p className="text-[10px] text-[#6E6E73] mt-2 text-right">
                    {new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })} ✓✓
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#FFF8E7] rounded-xl border border-[#FFD60A]/30">
                <AlertCircle size={14} className="text-[#FF9500] flex-shrink-0" />
                <p className="text-[11px] text-[#6E6E73]">
                  Se enviarán <strong>{activeRecipients.length}</strong> mensaje(s) vía WhatsApp
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-[#E8E8ED] p-5">
              <h3 className="text-[14px] font-semibold text-[#1D1D1F] mb-3">Estadísticas</h3>
              <div className="space-y-3">
                {[
                  { label: "Enviados hoy", value: logs.filter((l) => l.status === "sent").length, color: "text-green-600" },
                  { label: "Fallidos", value: logs.filter((l) => l.status === "failed").length, color: "text-red-600" },
                  { label: "Total mensajes", value: logs.length, color: "text-[#1D1D1F]" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <p className="text-[12px] text-[#6E6E73]">{s.label}</p>
                    <p className={cn("text-[14px] font-bold", s.color)}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={sending || activeRecipients.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-[#0071E3] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#0077ED] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Enviar a {activeRecipients.length} contacto(s)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message log */}
        {logs.length > 0 && (
          <div className="max-w-6xl mx-auto mt-6 bg-white rounded-2xl border border-[#E8E8ED] overflow-hidden">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="w-full flex items-center justify-between p-5 hover:bg-[#F9F9FB] transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#0071E3]" />
                <h3 className="text-[14px] font-semibold text-[#1D1D1F]">
                  Log de mensajes ({logs.length})
                </h3>
              </div>
              {showLogs ? <ChevronUp size={16} className="text-[#6E6E73]" /> : <ChevronDown size={16} className="text-[#6E6E73]" />}
            </button>

            {showLogs && (
              <div className="border-t border-[#E8E8ED] divide-y divide-[#F0F0F5]">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      {statusIcon(log.status)}
                      <div>
                        <p className="text-[13px] font-medium text-[#1D1D1F]">{log.recipient}</p>
                        <p className="text-[11px] text-[#6E6E73]">{log.phone} · {log.template}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-[#6E6E73]">{log.timestamp}</p>
                      {log.sid && <p className="text-[10px] text-[#AEAEB2]">{log.sid}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
