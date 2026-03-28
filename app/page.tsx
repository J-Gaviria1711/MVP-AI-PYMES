"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import MetricCard, { MetricCardSkeleton } from "@/components/dashboard/MetricCard";
import {
  TrendingUp, TrendingDown, Package, ShoppingCart,
  DollarSign, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Truck, Bell,
} from "lucide-react";
import { shortCOP, formatCOP, formatNumber } from "@/lib/utils";
import {
  monthlyFinancials, financeKPIs, operationsKPIs, ordersData, expenseCategories,
} from "@/lib/mockData";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const STATUS = {
  entregado:  { label: "Entregado",  color: "#1A8A3C", bg: "#F0FBF4", icon: CheckCircle2 },
  en_transito:{ label: "En tránsito",color: "#0066CC", bg: "#F0F4FF", icon: Truck },
  procesando: { label: "Procesando", color: "#C87000", bg: "#FFF8EC", icon: Clock },
  pendiente:  { label: "Pendiente",  color: "#6E6E73", bg: "#F5F5F7", icon: AlertCircle },
};

const ChartTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const names: Record<string, string> = { ingresos: "Ingresos", gastos: "Gastos", utilidad: "Utilidad" };
  return (
    <div className="apple-tooltip">
      <p style={{ fontSize: "11px", color: "#AEAEB2", marginBottom: "6px", fontWeight: 500 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600, fontSize: "13px" }}>
          {names[p.name] ?? p.name}: {shortCOP(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const totalIngresos = monthlyFinancials.reduce((a, b) => a + b.ingresos, 0);
  const totalGastos   = monthlyFinancials.reduce((a, b) => a + b.gastos, 0);
  const totalUtilidad = totalIngresos - totalGastos;
  const margenPct     = ((totalUtilidad / totalIngresos) * 100).toFixed(1);

  return (
    <div className="flex flex-col min-h-screen page-enter">
      <Header title="Dashboard General" subtitle="Resumen ejecutivo · Junio 2024" />

      <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto space-y-6">
        {/* Alert banner */}
        <div
          className="flex items-center justify-between px-5 py-4 rounded-[12px]"
          style={{ background: "#FFF8EC", border: "1px solid #FFD60A30" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] flex items-center justify-center" style={{ background: "#FF9F0A20" }}>
              <Bell size={15} style={{ color: "#C87000" }} />
            </div>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: "#92400E" }}>
                3 productos con stock crítico
              </p>
              <p className="text-[12px]" style={{ color: "#B45309" }}>
                Monitor Dell 24&quot;, Impresora Canon MX y Teclado Mecánico requieren reabastecimiento
              </p>
            </div>
          </div>
          <button className="text-[12px] font-semibold whitespace-nowrap transition-colors" style={{ color: "#C87000" }}>
            Ver inventario →
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <MetricCardSkeleton key={i} />)
          ) : (
            <>
              <MetricCard title="Ingresos (Jun)" value={shortCOP(financeKPIs.ingresosMes)}
                change={financeKPIs.ingresosCambio} icon={TrendingUp}
                iconColor="#0066CC" iconBg="#F0F4FF" subtitle="vs. mes anterior" />
              <MetricCard title="Gastos (Jun)" value={shortCOP(financeKPIs.gastosMes)}
                change={-financeKPIs.gastosCambio} icon={TrendingDown}
                iconColor="#FF9F0A" iconBg="#FFF8EC" subtitle="vs. mes anterior" />
              <MetricCard title="Utilidad Neta" value={shortCOP(financeKPIs.utilidadNeta)}
                change={financeKPIs.utilidadCambio} icon={DollarSign}
                iconColor="#34C759" iconBg="#F0FBF4" subtitle={`Margen: ${financeKPIs.margenBruto}%`} />
              <MetricCard title="Pedidos (Jun)" value={formatNumber(operationsKPIs.pedidosMes)}
                change={operationsKPIs.pedidosCambio} icon={ShoppingCart}
                iconColor="#AF52DE" iconBg="#F9F0FF" subtitle={`Fulfillment: ${operationsKPIs.tasaCumplimiento}%`} />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6">
          {/* Area Chart */}
          <div className="col-span-2 bg-white rounded-[16px] p-6"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[16px] font-semibold text-[#1D1D1F]">Ingresos vs. Gastos</h2>
                <p className="text-[12px] text-[#6E6E73] mt-0.5">Enero – Diciembre 2024</p>
              </div>
              <div className="flex items-center gap-4">
                {[
                  { color: "#0066CC", label: "Ingresos" },
                  { color: "#FF9F0A", label: "Gastos" },
                  { color: "#34C759", label: "Utilidad" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-[11px] text-[#6E6E73]">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="skeleton rounded-[8px]" style={{ height: 240 }} />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyFinancials} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0066CC" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#0066CC" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gUtilidad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#34C759" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => shortCOP(v)} tick={{ fontSize: 10, fill: "#AEAEB2" }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#E0E0E0", strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="ingresos" stroke="#0066CC" strokeWidth={2} fill="url(#gIngresos)" dot={false} />
                  <Area type="monotone" dataKey="gastos" stroke="#FF9F0A" strokeWidth={2} fill="none" strokeDasharray="5 3" dot={false} />
                  <Area type="monotone" dataKey="utilidad" stroke="#34C759" strokeWidth={2} fill="url(#gUtilidad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-[16px] p-6"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}>
            <h2 className="text-[16px] font-semibold text-[#1D1D1F]">Distribución Gastos</h2>
            <p className="text-[12px] text-[#6E6E73] mt-0.5 mb-4">Junio 2024</p>
            {loading ? (
              <div className="skeleton rounded-full mx-auto" style={{ width: 120, height: 120 }} />
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value">
                    {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="space-y-2 mt-3">
              {expenseCategories.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-[12px] text-[#6E6E73]">{cat.name}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-[#1D1D1F]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Orders */}
          <div className="bg-white rounded-[16px] p-6"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold text-[#1D1D1F]">Pedidos Recientes</h2>
              <a href="/operaciones" className="flex items-center gap-1 text-[12px] font-medium transition-colors"
                style={{ color: "#0066CC" }}>
                Ver todos <ArrowUpRight size={13} />
              </a>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="skeleton w-7 h-7 rounded-[8px]" />
                      <div className="space-y-1.5">
                        <div className="skeleton w-28 h-3 rounded" />
                        <div className="skeleton w-16 h-2.5 rounded" />
                      </div>
                    </div>
                    <div className="skeleton w-16 h-3 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {ordersData.slice(0, 5).map((order) => {
                  const s = STATUS[order.estado as keyof typeof STATUS];
                  return (
                    <div key={order.id} className="flex items-center justify-between py-2.5 transition-colors rounded-[8px] px-2 hover:bg-[#FAFAFA]"
                      style={{ borderBottom: "1px solid #F5F5F7" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                          style={{ background: s.bg }}>
                          <s.icon size={14} style={{ color: s.color }} />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-[#1D1D1F]">{order.cliente}</p>
                          <p className="text-[11px] text-[#AEAEB2]">{order.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-semibold text-[#1D1D1F]">{shortCOP(order.valor)}</p>
                        <p className="text-[11px]" style={{ color: s.color }}>{s.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Annual summary */}
          <div className="bg-white rounded-[16px] p-6"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}>
            <h2 className="text-[16px] font-semibold text-[#1D1D1F]">Resumen Anual 2024</h2>
            <p className="text-[12px] text-[#6E6E73] mt-0.5 mb-6">Acumulado enero – diciembre</p>

            <div className="space-y-5">
              {[
                { label: "Total Ingresos", value: formatCOP(totalIngresos), color: "#0066CC", pct: 100 },
                { label: "Total Gastos",   value: formatCOP(totalGastos),   color: "#FF9F0A", pct: (totalGastos / totalIngresos) * 100 },
                { label: "Utilidad Total", value: formatCOP(totalUtilidad), color: "#34C759", pct: (totalUtilidad / totalIngresos) * 100 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[13px] text-[#6E6E73]">{item.label}</span>
                    <span className="text-[13px] font-semibold text-[#1D1D1F]">{item.value}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="p-4 rounded-[12px]" style={{ background: "#F5F5F7" }}>
                <p className="text-[11px] text-[#6E6E73] mb-1">Margen Neto</p>
                <p className="text-[24px] font-semibold text-[#1D1D1F]">{margenPct}%</p>
              </div>
              <div className="p-4 rounded-[12px]" style={{ background: "#F0FBF4" }}>
                <p className="text-[11px] text-[#6E6E73] mb-1">Inventario</p>
                <p className="text-[24px] font-semibold text-[#1D1D1F]">{shortCOP(operationsKPIs.valorInventario)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-[10px]" style={{ background: "#F0F4FF" }}>
              <Package size={14} style={{ color: "#0066CC" }} />
              <p className="text-[12px] font-medium" style={{ color: "#0066CC" }}>
                {operationsKPIs.productosBajoStock} productos bajo stock mínimo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
