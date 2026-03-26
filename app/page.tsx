"use client";

import Header from "@/components/layout/Header";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react";
import { shortCOP, formatCOP, formatNumber } from "@/lib/utils";
import {
  monthlyFinancials,
  financeKPIs,
  operationsKPIs,
  ordersData,
  expenseCategories,
} from "@/lib/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const statusConfig = {
  entregado: { label: "Entregado", color: "text-[#1A8A3C]", bg: "bg-[#E8F8ED]", icon: CheckCircle2 },
  en_transito: { label: "En tránsito", color: "text-[#0071E3]", bg: "bg-[#E8F1FC]", icon: Truck },
  procesando: { label: "Procesando", color: "text-[#B45309]", bg: "bg-[#FFF3E0]", icon: Clock },
  pendiente: { label: "Pendiente", color: "text-[#6E6E73]", bg: "bg-[#F5F5F7]", icon: AlertCircle },
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const labels: Record<string, string> = {
      ingresos: "Ingresos",
      gastos: "Gastos",
      utilidad: "Utilidad",
    };
    return (
      <div className="bg-white rounded-xl shadow-lg border border-[#E8E8ED] px-4 py-3">
        <p className="text-[12px] font-semibold text-[#6E6E73] mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-[13px] font-semibold" style={{ color: p.color }}>
            {labels[p.name] ?? p.name}: {shortCOP(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const totalIngresos = monthlyFinancials.reduce((a, b) => a + b.ingresos, 0);
  const totalGastos = monthlyFinancials.reduce((a, b) => a + b.gastos, 0);
  const totalUtilidad = totalIngresos - totalGastos;
  const margenPromedio = ((totalUtilidad / totalIngresos) * 100).toFixed(1);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard General" subtitle="Resumen ejecutivo · Junio 2024" />

      <div className="flex-1 p-8 space-y-6">
        {/* Alert banner */}
        <div className="bg-[#FFF3E0] border border-[#FFD580] rounded-2xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-[#B45309] flex-shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-[#92400E]">
                3 productos con stock crítico
              </p>
              <p className="text-[12px] text-[#B45309]">
                Monitor Dell 24&quot;, Impresora Canon MX y Teclado Mecánico requieren reabastecimiento inmediato
              </p>
            </div>
          </div>
          <button className="text-[12px] font-semibold text-[#B45309] hover:text-[#92400E] whitespace-nowrap transition-colors">
            Ver inventario →
          </button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Ingresos (Jun)"
            value={shortCOP(financeKPIs.ingresosMes)}
            change={financeKPIs.ingresosCambio}
            icon={TrendingUp}
            iconColor="text-[#0071E3]"
            iconBg="bg-[#E8F1FC]"
            subtitle="vs. mes anterior"
          />
          <MetricCard
            title="Gastos (Jun)"
            value={shortCOP(financeKPIs.gastosMes)}
            change={-financeKPIs.gastosCambio}
            icon={TrendingDown}
            iconColor="text-[#FF9F0A]"
            iconBg="bg-[#FFF3E0]"
            subtitle="vs. mes anterior"
          />
          <MetricCard
            title="Utilidad Neta"
            value={shortCOP(financeKPIs.utilidadNeta)}
            change={financeKPIs.utilidadCambio}
            icon={DollarSign}
            iconColor="text-[#34C759]"
            iconBg="bg-[#E8F8ED]"
            subtitle={`Margen: ${financeKPIs.margenBruto}%`}
          />
          <MetricCard
            title="Pedidos (Jun)"
            value={formatNumber(operationsKPIs.pedidosMes)}
            change={operationsKPIs.pedidosCambio}
            icon={ShoppingCart}
            iconColor="text-[#AF52DE]"
            iconBg="bg-[#F4EAFD]"
            subtitle={`Fulfillment: ${operationsKPIs.tasaCumplimiento}%`}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[15px] font-semibold text-[#1D1D1F]">Ingresos vs. Gastos</h2>
                <p className="text-[12px] text-[#6E6E73]">Enero – Diciembre 2024</p>
              </div>
              <div className="flex items-center gap-4">
                {[
                  { color: "#0071E3", label: "Ingresos" },
                  { color: "#FF9F0A", label: "Gastos" },
                  { color: "#34C759", label: "Utilidad" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-[11px] text-[#6E6E73]">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyFinancials} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071E3" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0071E3" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUtilidad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34C759" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => shortCOP(v)} tick={{ fontSize: 10, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ingresos" stroke="#0071E3" strokeWidth={2} fill="url(#colorIngresos)" />
                <Area type="monotone" dataKey="gastos" stroke="#FF9F0A" strokeWidth={2} fill="none" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="utilidad" stroke="#34C759" strokeWidth={2} fill="url(#colorUtilidad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
            <h2 className="text-[15px] font-semibold text-[#1D1D1F] mb-1">Distribución Gastos</h2>
            <p className="text-[12px] text-[#6E6E73] mb-4">Junio 2024</p>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={2} dataKey="value">
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {expenseCategories.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-[11px] text-[#6E6E73]">{cat.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#1D1D1F]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold text-[#1D1D1F]">Pedidos Recientes</h2>
              <a href="/operaciones" className="text-[12px] text-[#0071E3] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Ver todos <ArrowUpRight size={13} />
              </a>
            </div>
            <div className="space-y-3">
              {ordersData.slice(0, 5).map((order) => {
                const status = statusConfig[order.estado as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#F5F5F7] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg ${status.bg} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon size={13} className={status.color} />
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-[#1D1D1F]">{order.cliente}</p>
                        <p className="text-[10px] text-[#AEAEB2]">{order.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-semibold text-[#1D1D1F]">{shortCOP(order.valor)}</p>
                      <span className={`text-[10px] font-medium ${status.color}`}>{status.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Annual Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
            <h2 className="text-[15px] font-semibold text-[#1D1D1F] mb-1">Resumen Anual</h2>
            <p className="text-[12px] text-[#6E6E73] mb-5">Acumulado enero – diciembre 2024</p>
            <div className="space-y-4">
              {[
                { label: "Total Ingresos", value: formatCOP(totalIngresos), color: "#0071E3", pct: 100 },
                { label: "Total Gastos", value: formatCOP(totalGastos), color: "#FF9F0A", pct: (totalGastos / totalIngresos) * 100 },
                { label: "Utilidad Total", value: formatCOP(totalUtilidad), color: "#34C759", pct: (totalUtilidad / totalIngresos) * 100 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[12px] text-[#6E6E73]">{item.label}</span>
                    <span className="text-[13px] font-semibold text-[#1D1D1F]">{item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 bg-[#F5F5F7] rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#6E6E73]">Margen Neto Promedio</p>
                  <p className="text-[22px] font-semibold text-[#1D1D1F]">{margenPromedio}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#6E6E73]">Inventario Activo</p>
                  <p className="text-[22px] font-semibold text-[#1D1D1F]">{shortCOP(operationsKPIs.valorInventario)}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 p-3 bg-[#E8F1FC] rounded-xl">
              <Package size={15} className="text-[#0071E3]" />
              <p className="text-[12px] text-[#0071E3] font-medium">
                {operationsKPIs.productosBajoStock} productos bajo stock mínimo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
