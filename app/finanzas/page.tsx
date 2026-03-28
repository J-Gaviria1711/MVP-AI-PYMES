"use client";

import Header from "@/components/layout/Header";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { shortCOP, formatCOP, formatNumber } from "@/lib/utils";
import {
  monthlyFinancials,
  cashFlowData,
  expenseCategories,
  financeKPIs,
  budgetVsActual,
} from "@/lib/mockData";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";

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
    return (
      <div className="apple-tooltip">
        <p className="text-[12px] font-semibold text-[#6E6E73] mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-[12px] font-semibold" style={{ color: p.color }}>
            {p.name}: {shortCOP(Math.abs(p.value))}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const tabs = ["Resumen", "Flujo de Caja", "P&L", "Presupuesto"];

export default function FinanzasPage() {
  return (
    <div className="page-enter flex flex-col min-h-screen">
      <Header
        title="Módulo Finanzas"
        subtitle="Análisis financiero completo · PESOS COP"
      />

      <div className="flex-1 p-8 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-[#F0F0F5] rounded-xl p-1 w-fit">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-all ${
                i === 0
                  ? "bg-white text-[#1D1D1F] shadow-sm"
                  : "text-[#6E6E73] hover:text-[#1D1D1F]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Ingresos del Mes"
            value={shortCOP(financeKPIs.ingresosMes)}
            change={financeKPIs.ingresosCambio}
            icon={TrendingUp}
            iconColor="text-[#0066CC]"
            iconBg="bg-[#E8F1FC]"
            subtitle="vs. mes anterior"
          />
          <MetricCard
            title="Gastos del Mes"
            value={shortCOP(financeKPIs.gastosMes)}
            change={-financeKPIs.gastosCambio}
            icon={TrendingDown}
            iconColor="text-[#FF9F0A]"
            iconBg="bg-[#FFF8EC]"
            subtitle="vs. mes anterior"
          />
          <MetricCard
            title="Utilidad Neta"
            value={shortCOP(financeKPIs.utilidadNeta)}
            change={financeKPIs.utilidadCambio}
            icon={DollarSign}
            iconColor="text-[#34C759]"
            iconBg="bg-[#F0FBF4]"
            subtitle={`Margen: ${financeKPIs.margenBruto}%`}
          />
          <MetricCard
            title="Flujo de Caja"
            value={shortCOP(financeKPIs.flujoCaja)}
            change={financeKPIs.flujoCajaChange}
            icon={CreditCard}
            iconColor="text-[#AF52DE]"
            iconBg="bg-[#F4EAFD]"
            subtitle="Acumulado 2024"
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Cuentas por Cobrar",
              value: formatCOP(financeKPIs.cuentasPorCobrar),
              icon: ArrowUpRight,
              color: "#0066CC",
              bg: "#E8F1FC",
              note: "Promedio 32 días",
            },
            {
              label: "Cuentas por Pagar",
              value: formatCOP(financeKPIs.cuentasPorPagar),
              icon: ArrowDownRight,
              color: "#FF3B30",
              bg: "#FFF1F0",
              note: "Vencimiento promedio 45 días",
            },
            {
              label: "ROI Marketing",
              value: `${financeKPIs.roiMarketing}x`,
              icon: BarChart3,
              color: "#34C759",
              bg: "#F0FBF4",
              note: "Por cada $1 invertido",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-[16px] p-6 flex items-center gap-4"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: item.bg }}
              >
                <item.icon size={22} style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-[12px] text-[#6E6E73]">{item.label}</p>
                <p className="text-[20px] font-semibold text-[#1D1D1F]">{item.value}</p>
                <p className="text-[11px] text-[#AEAEB2]">{item.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue trend */}
          <div
            className="col-span-2 bg-white rounded-[16px] p-6"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
                  Evolución Financiera
                </h3>
                <p className="text-[12px] text-[#6E6E73]">Ingresos · Gastos · Utilidad</p>
              </div>
              <select className="text-[12px] text-[#6E6E73] bg-[#F5F5F7] border-0 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/20">
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyFinancials} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => shortCOP(v)} tick={{ fontSize: 10, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="ingresos" name="Ingresos" fill="#0066CC" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gastos" name="Gastos" fill="#E8F1FC" radius={[4, 4, 0, 0]} />
                <Bar dataKey="utilidad" name="Utilidad" fill="#34C759" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense breakdown */}
          <div
            className="bg-white rounded-[16px] p-6"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
          >
            <h3 className="text-[16px] font-semibold text-[#1D1D1F] mb-1">
              Estructura de Gastos
            </h3>
            <p className="text-[12px] text-[#6E6E73] mb-3">Junio 2024</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {expenseCategories.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {expenseCategories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-[11px] text-[#6E6E73]">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#AEAEB2]">{shortCOP(cat.amount)}</span>
                    <span className="text-[11px] font-semibold text-[#1D1D1F] w-8 text-right">{cat.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cash flow chart */}
        <div
          className="bg-white rounded-[16px] p-6"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[16px] font-semibold text-[#1D1D1F]">Flujo de Caja</h3>
              <p className="text-[12px] text-[#6E6E73]">Entradas, salidas y acumulado</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#6E6E73]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-[#34C759] rounded" />
                Entradas
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-[#FF3B30] rounded" />
                Salidas
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-[#0066CC]" />
                Acumulado
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cashFlowData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34C759" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066CC" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0066CC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => shortCOP(Math.abs(v))} tick={{ fontSize: 10, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#D2D2D7" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="entradas" name="Entradas" stroke="#34C759" strokeWidth={2} fill="url(#colorEntradas)" />
              <Area type="monotone" dataKey="salidas" name="Salidas" stroke="#FF3B30" strokeWidth={2} fill="none" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="acumulado" name="Acumulado" stroke="#0066CC" strokeWidth={2.5} fill="url(#colorAcumulado)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Budget vs Actual */}
        <div
          className="bg-white rounded-[16px] p-6"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <h3 className="text-[16px] font-semibold text-[#1D1D1F] mb-1">
            Presupuesto vs. Real
          </h3>
          <p className="text-[12px] text-[#6E6E73] mb-5">Junio 2024 · Variación en %</p>
          <div className="overflow-x-auto">
            <table className="apple-table w-full">
              <thead>
                <tr className="border-b border-[#F0F0F0]">
                  {["Categoría", "Presupuesto", "Real", "Variación", "Estado"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budgetVsActual.map((row) => {
                  const favorable = row.variacion >= 0;
                  return (
                    <tr key={row.categoria} className="border-b border-[#F0F0F0] hover:bg-[#F5F5F7] transition-colors">
                      <td className="py-3 pr-4 text-[13px] font-medium text-[#1D1D1F]">{row.categoria}</td>
                      <td className="py-3 pr-4 text-[13px] text-[#6E6E73]">{formatCOP(row.presupuesto)}</td>
                      <td className="py-3 pr-4 text-[13px] font-medium text-[#1D1D1F]">{formatCOP(row.real)}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-[12px] font-semibold ${favorable ? "text-[#1A8A3C]" : "text-[#CC2929]"}`}>
                          {favorable ? "+" : ""}{row.variacion.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className="inline-flex items-center"
                          style={{
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: 500,
                            background: favorable ? "#F0FBF4" : "#FFF1F0",
                            color: favorable ? "#1A8A3C" : "#CC2929",
                          }}
                        >
                          {favorable ? "✓ Meta" : "▼ Déficit"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Indicators */}
        <div
          className="bg-white rounded-[16px] p-6"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <h3 className="text-[16px] font-semibold text-[#1D1D1F] mb-5">
            Indicadores Financieros Clave
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Margen Bruto", value: "37.9%", status: "good", benchmark: "Sector: ~32%" },
              { name: "Liquidez Corriente", value: "2.03", status: "good", benchmark: "Mínimo recomendado: 1.5" },
              { name: "Nivel de Endeudamiento", value: "28.4%", status: "good", benchmark: "Máximo saludable: 60%" },
              { name: "Rotación Cartera", value: "32 días", status: "warning", benchmark: "Objetivo: <30 días" },
              { name: "EBITDA Margin", value: "21.3%", status: "good", benchmark: "Sector: ~18%" },
              { name: "Punto de Equilibrio", value: shortCOP(85000000), status: "good", benchmark: "Se alcanza en ~2 semanas" },
              { name: "Capital de Trabajo", value: shortCOP(financeKPIs.flujoCaja - financeKPIs.cuentasPorPagar), status: "good", benchmark: "Positivo" },
              { name: "ROE", value: "18.5%", status: "good", benchmark: "Objetivo: >15%" },
            ].map((indicator) => (
              <div
                key={indicator.name}
                className="p-4 rounded-[12px]"
                style={{ background: "#F5F5F7" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[11px] text-[#6E6E73] font-medium leading-tight">{indicator.name}</p>
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ml-2 ${
                      indicator.status === "good" ? "bg-[#34C759]" : "bg-[#FF9F0A]"
                    }`}
                  />
                </div>
                <p className="text-[18px] font-semibold text-[#1D1D1F]">{indicator.value}</p>
                <p className="text-[10px] text-[#AEAEB2] mt-1">{indicator.benchmark}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
