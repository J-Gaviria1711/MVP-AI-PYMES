"use client";

import { useState, useRef } from "react";
import Header from "@/components/layout/Header";
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCOP } from "@/lib/utils";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  reference: string;
  status: "reconciled" | "review" | "unidentified";
  confidence: number;
  matchedTo?: { unit: string; resident: string; amount: number };
  notes: string;
  approved?: boolean;
  rejected?: boolean;
}

interface ReconciliationResult {
  bank: string;
  totalTransactions: number;
  results: Transaction[];
  summary: {
    reconciled: number;
    review: number;
    unidentified: number;
    totalAmount: number;
  };
  demo?: boolean;
}

export default function ConciliacionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReconciliationResult | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const MOCK_PORTFOLIO = [
    { unit: "101", resident: "Carlos Martínez", amount: 320000, concept: "Cuota Jun 2024" },
    { unit: "203", resident: "Ana López", amount: 320000, concept: "Cuota Jun 2024" },
    { unit: "305", resident: "Pedro Gómez", amount: 640000, concept: "Cuota May-Jun 2024" },
  ];

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  }

  async function runReconciliation() {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("portfolio", JSON.stringify(MOCK_PORTFOLIO));

    try {
      const res = await fetch("/api/bank-reconciliation", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success) {
        alert("Error: " + data.error);
        return;
      }

      setResult(data);
      setTransactions(data.results || []);
    } catch (error) {
      console.error(error);
      alert("Error al procesar el archivo. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function approveTransaction(id: string) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approved: true, rejected: false } : t))
    );
  }

  function rejectTransaction(id: string) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, rejected: true, approved: false } : t))
    );
  }

  function reassignTransaction(id: string, unit: string) {
    const portfolio = MOCK_PORTFOLIO.find((p) => p.unit === unit);
    if (!portfolio) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              matchedTo: { unit: portfolio.unit, resident: portfolio.resident, amount: portfolio.amount },
              status: "reconciled" as const,
              confidence: 100,
              notes: "Reasignado manualmente",
              approved: true,
            }
          : t
      )
    );
  }

  const statusBadge = (t: Transaction) => {
    if (t.approved)
      return (
        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">
          <CheckCircle size={10} /> Aprobado
        </span>
      );
    if (t.rejected)
      return (
        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-red-50 text-red-700 rounded-full font-medium">
          <XCircle size={10} /> Rechazado
        </span>
      );
    if (t.status === "reconciled")
      return (
        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">
          <CheckCircle size={10} /> Identificado {t.confidence}%
        </span>
      );
    if (t.status === "review")
      return (
        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full font-medium">
          <AlertTriangle size={10} /> Revisar {t.confidence}%
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-red-50 text-red-700 rounded-full font-medium">
        <XCircle size={10} /> Sin identificar
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Conciliación Bancaria"
        subtitle="Cruza tu extracto bancario con la cartera usando IA"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Upload zone */}
          {!result && (
            <div className="bg-white rounded-2xl border border-[#E8E8ED] p-8 text-center">
              <div
                className="border-2 border-dashed border-[#E8E8ED] rounded-xl p-10 cursor-pointer hover:border-[#0071E3] hover:bg-[#F0F8FF] transition-all"
                onClick={() => fileRef.current?.click()}
              >
                <FileSpreadsheet size={40} className="text-[#0071E3] mx-auto mb-3" />
                <p className="text-[15px] font-semibold text-[#1D1D1F] mb-1">
                  {file ? file.name : "Sube tu extracto bancario"}
                </p>
                <p className="text-[13px] text-[#6E6E73]">
                  Acepta .xlsx o .csv — Bancolombia, Davivienda, Banco de Bogotá
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleUpload}
                />
              </div>
              {file && (
                <button
                  onClick={runReconciliation}
                  disabled={loading}
                  className="mt-5 flex items-center gap-2 mx-auto px-8 py-3 bg-[#0071E3] text-white rounded-xl text-[14px] font-semibold hover:bg-[#0077ED] disabled:opacity-50 transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analizando con IA...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Iniciar conciliación
                    </>
                  )}
                </button>
              )}

              <div className="mt-6 grid grid-cols-3 gap-4 text-left">
                {[
                  { bank: "Bancolombia", desc: "Extracto en Excel con columnas estándar" },
                  { bank: "Davivienda", desc: "Formato CSV o Excel del portal web" },
                  { bank: "Banco de Bogotá", desc: "Extracto descargado de banca en línea" },
                ].map((b) => (
                  <div key={b.bank} className="p-3 bg-[#F9F9FB] rounded-xl">
                    <p className="text-[12px] font-semibold text-[#1D1D1F]">{b.bank}</p>
                    <p className="text-[11px] text-[#6E6E73] mt-0.5">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    label: "Total transacciones",
                    value: result.totalTransactions,
                    color: "text-[#1D1D1F]",
                    bg: "bg-white",
                  },
                  {
                    label: "Conciliadas",
                    value: result.summary.reconciled,
                    color: "text-green-600",
                    bg: "bg-green-50",
                    icon: CheckCircle,
                  },
                  {
                    label: "Requieren revisión",
                    value: result.summary.review,
                    color: "text-yellow-600",
                    bg: "bg-yellow-50",
                    icon: AlertTriangle,
                  },
                  {
                    label: "Sin identificar",
                    value: result.summary.unidentified,
                    color: "text-red-600",
                    bg: "bg-red-50",
                    icon: XCircle,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={cn("rounded-2xl border border-[#E8E8ED] p-4", s.bg)}
                  >
                    <p className="text-[11px] text-[#6E6E73] mb-1">{s.label}</p>
                    <p className={cn("text-[28px] font-bold", s.color)}>{s.value}</p>
                    <p className="text-[11px] text-[#6E6E73] mt-1">
                      {formatCOP(result.summary.totalAmount / result.totalTransactions)} prom.
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[#1D1D1F]">
                    Banco detectado: {result.bank}
                    {result.demo && (
                      <span className="ml-2 text-[11px] bg-[#FFF8E7] text-[#FF9500] px-2 py-0.5 rounded-full">
                        Modo demo
                      </span>
                    )}
                  </p>
                  <p className="text-[12px] text-[#6E6E73]">
                    Revisa y aprueba cada transacción antes de actualizar la cartera
                  </p>
                </div>
                <button
                  onClick={() => { setResult(null); setFile(null); setTransactions([]); }}
                  className="flex items-center gap-1.5 text-[12px] text-[#0071E3] font-medium hover:underline"
                >
                  <RefreshCw size={13} />
                  Nueva conciliación
                </button>
              </div>

              {/* Transactions list */}
              <div className="bg-white rounded-2xl border border-[#E8E8ED] overflow-hidden">
                <div className="divide-y divide-[#F0F0F5]">
                  {transactions.map((t) => (
                    <div key={t.id} className="p-4">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              t.status === "reconciled" ? "bg-green-500" :
                              t.status === "review" ? "bg-yellow-500" : "bg-red-500"
                            )}
                          />
                          <div>
                            <p className="text-[13px] font-medium text-[#1D1D1F]">
                              {t.description || t.id}
                            </p>
                            <p className="text-[11px] text-[#6E6E73]">
                              {t.date} {t.reference && `· Ref: ${t.reference}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-[14px] font-semibold text-[#1D1D1F]">
                            {formatCOP(t.amount)}
                          </p>
                          {statusBadge(t)}
                          {expandedId === t.id ? (
                            <ChevronUp size={14} className="text-[#6E6E73]" />
                          ) : (
                            <ChevronDown size={14} className="text-[#6E6E73]" />
                          )}
                        </div>
                      </div>

                      {expandedId === t.id && (
                        <div className="mt-4 pl-5 space-y-3">
                          {t.matchedTo && (
                            <div className="p-3 bg-[#F9F9FB] rounded-xl">
                              <p className="text-[11px] text-[#6E6E73] mb-1">Coincidencia detectada</p>
                              <p className="text-[13px] font-medium text-[#1D1D1F]">
                                Unidad {t.matchedTo.unit} — {t.matchedTo.resident}
                              </p>
                              <p className="text-[11px] text-[#6E6E73]">
                                Valor esperado: {formatCOP(t.matchedTo.amount)}
                              </p>
                            </div>
                          )}
                          {t.notes && (
                            <p className="text-[12px] text-[#6E6E73]">{t.notes}</p>
                          )}

                          {!t.approved && !t.rejected && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => approveTransaction(t.id)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-[12px] font-medium rounded-xl hover:bg-green-700"
                              >
                                <CheckCircle size={13} /> Aprobar
                              </button>
                              <button
                                onClick={() => rejectTransaction(t.id)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-[12px] font-medium rounded-xl hover:bg-red-700"
                              >
                                <XCircle size={13} /> Rechazar
                              </button>
                              <select
                                onChange={(e) => e.target.value && reassignTransaction(t.id, e.target.value)}
                                className="px-3 py-2 text-[12px] bg-[#F5F5F7] border border-[#E8E8ED] rounded-xl focus:outline-none"
                                defaultValue=""
                              >
                                <option value="">Reasignar a...</option>
                                {MOCK_PORTFOLIO.map((p) => (
                                  <option key={p.unit} value={p.unit}>
                                    Unidad {p.unit} — {p.resident}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
