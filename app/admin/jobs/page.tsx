"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  Clock,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JobRun {
  at: string;
  status: "success" | "error";
  processed?: number;
  error?: string;
}

interface Job {
  id: string;
  name: string;
  description: string;
  schedule: string;
  scheduleHuman: string;
  endpoint: string;
  active: boolean;
  lastRun?: string;
  lastStatus?: "success" | "error";
  runs: JobRun[];
}

const INITIAL_JOBS: Job[] = [
  {
    id: "generate-fees",
    name: "Generación de cuotas",
    description: "Genera automáticamente las cuotas mensuales para todos los activos",
    schedule: "0 0 1 * *",
    scheduleHuman: "Día 1 de cada mes, 12:00am",
    endpoint: "/api/cron/generate-fees",
    active: true,
    lastRun: "01/06/2024, 12:00am",
    lastStatus: "success",
    runs: [
      { at: "01/06/2024, 12:00am", status: "success", processed: 120 },
      { at: "01/05/2024, 12:00am", status: "success", processed: 118 },
      { at: "01/04/2024, 12:00am", status: "success", processed: 120 },
    ],
  },
  {
    id: "reminders-30",
    name: "Recordatorios 30+ días",
    description: "Detecta morosos con más de 30 días y envía WhatsApp automático",
    schedule: "0 14 * * *",
    scheduleHuman: "Todos los días, 9:00am",
    endpoint: "/api/cron/reminders-30",
    active: true,
    lastRun: "28/03/2026, 9:00am",
    lastStatus: "success",
    runs: [
      { at: "28/03/2026, 9:00am", status: "success", processed: 3 },
      { at: "27/03/2026, 9:00am", status: "success", processed: 5 },
      { at: "26/03/2026, 9:00am", status: "error", error: "Twilio rate limit exceeded" },
    ],
  },
  {
    id: "reminders-60",
    name: "Recordatorios urgentes 60+",
    description: "Morosos con más de 60 días, tono urgente con aviso de cobro jurídico",
    schedule: "0 14 * * *",
    scheduleHuman: "Todos los días, 9:00am",
    endpoint: "/api/cron/reminders-60",
    active: true,
    lastRun: "28/03/2026, 9:00am",
    lastStatus: "success",
    runs: [
      { at: "28/03/2026, 9:00am", status: "success", processed: 2 },
      { at: "27/03/2026, 9:00am", status: "success", processed: 2 },
    ],
  },
  {
    id: "weekly-summary",
    name: "Resumen semanal",
    description: "Envía al administrador un resumen de cartera vía WhatsApp cada lunes",
    schedule: "0 14 * * 1",
    scheduleHuman: "Cada lunes, 9:00am",
    endpoint: "/api/cron/weekly-summary",
    active: false,
    lastRun: "25/03/2026, 9:00am",
    lastStatus: "success",
    runs: [
      { at: "25/03/2026, 9:00am", status: "success" },
      { at: "18/03/2026, 9:00am", status: "success" },
    ],
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [runningJob, setRunningJob] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  function toggleJob(id: string) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, active: !j.active } : j)));
  }

  async function runJob(job: Job) {
    setRunningJob(job.id);
    try {
      const res = await fetch(job.endpoint);
      const data = await res.json();
      const now = new Date().toLocaleString("es-CO");
      const newRun: JobRun = {
        at: now,
        status: data.status === "error" ? "error" : "success",
        processed: data.processed,
        error: data.error,
      };
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? {
                ...j,
                lastRun: now,
                lastStatus: newRun.status,
                runs: [newRun, ...j.runs.slice(0, 9)],
              }
            : j
        )
      );
      setExpandedJob(job.id);
    } catch (error) {
      console.error(error);
    } finally {
      setRunningJob(null);
    }
  }

  const activeCount = jobs.filter((j) => j.active).length;
  const errorCount = jobs.filter((j) => j.lastStatus === "error").length;

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Jobs Automáticos"
        subtitle="Panel de control de tareas programadas"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Jobs activos", value: activeCount, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
              { label: "Jobs pausados", value: jobs.length - activeCount, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
              { label: "Con errores", value: errorCount, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
            ].map((s) => (
              <div key={s.label} className={cn("rounded-2xl border border-[#E8E8ED] p-4", s.bg)}>
                <div className="flex items-center gap-2 mb-1">
                  <s.icon size={14} className={s.color} />
                  <p className="text-[11px] text-[#6E6E73]">{s.label}</p>
                </div>
                <p className={cn("text-[32px] font-bold", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Jobs list */}
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-[#E8E8ED] overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[14px] font-semibold text-[#1D1D1F]">{job.name}</h3>
                        <span
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-medium",
                            job.active
                              ? "bg-green-50 text-green-700"
                              : "bg-[#F5F5F7] text-[#6E6E73]"
                          )}
                        >
                          {job.active ? "Activo" : "Pausado"}
                        </span>
                        {job.lastStatus === "error" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-700">
                            Error en último run
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#6E6E73] mb-2">{job.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-[#AEAEB2]">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {job.scheduleHuman}
                        </span>
                        {job.lastRun && (
                          <span>
                            Último run: {job.lastRun}
                            {job.lastStatus === "success" ? (
                              <CheckCircle size={10} className="inline ml-1 text-green-500" />
                            ) : (
                              <XCircle size={10} className="inline ml-1 text-red-500" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => runJob(job)}
                        disabled={runningJob === job.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#F5F5F7] text-[#1D1D1F] text-[12px] font-medium rounded-xl hover:bg-[#E8E8ED] disabled:opacity-50 transition-all"
                        title="Ejecutar ahora"
                      >
                        {runningJob === job.id ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : (
                          <Play size={13} />
                        )}
                        Ejecutar
                      </button>
                      <button
                        onClick={() => toggleJob(job.id)}
                        className="p-2 rounded-xl hover:bg-[#F5F5F7] transition-colors"
                        title={job.active ? "Pausar" : "Activar"}
                      >
                        {job.active ? (
                          <ToggleRight size={22} className="text-[#0071E3]" />
                        ) : (
                          <ToggleLeft size={22} className="text-[#AEAEB2]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    className="mt-3 text-[11px] text-[#0071E3] font-medium hover:underline"
                  >
                    {expandedJob === job.id ? "Ocultar" : "Ver"} historial de ejecuciones
                  </button>
                </div>

                {expandedJob === job.id && job.runs.length > 0 && (
                  <div className="border-t border-[#F0F0F5]">
                    <div className="px-5 py-3 bg-[#F9F9FB]">
                      <p className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wide">
                        Historial de ejecuciones
                      </p>
                    </div>
                    <div className="divide-y divide-[#F0F0F5]">
                      {job.runs.map((run, i) => (
                        <div key={i} className="flex items-center justify-between px-5 py-3">
                          <div className="flex items-center gap-2">
                            {run.status === "success" ? (
                              <CheckCircle size={13} className="text-green-500" />
                            ) : (
                              <XCircle size={13} className="text-red-500" />
                            )}
                            <p className="text-[12px] text-[#1D1D1F]">{run.at}</p>
                          </div>
                          <div className="text-right">
                            {run.status === "success" ? (
                              <p className="text-[11px] text-green-600 font-medium">
                                Exitoso
                                {run.processed !== undefined && ` · ${run.processed} procesados`}
                              </p>
                            ) : (
                              <p className="text-[11px] text-red-600 font-medium">
                                {run.error || "Error"}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* vercel.json hint */}
          <div className="bg-[#1D1D1F] rounded-2xl p-5 text-white">
            <p className="text-[12px] font-semibold text-[#AEAEB2] mb-2">Configuración en vercel.json</p>
            <pre className="text-[11px] text-[#34C759] overflow-auto">
{`{
  "crons": [
    { "path": "/api/cron/generate-fees", "schedule": "0 0 1 * *" },
    { "path": "/api/cron/reminders-30", "schedule": "0 14 * * *" },
    { "path": "/api/cron/reminders-60", "schedule": "0 14 * * *" },
    { "path": "/api/cron/weekly-summary", "schedule": "0 14 * * 1" }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
