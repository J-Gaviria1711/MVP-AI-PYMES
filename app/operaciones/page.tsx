"use client";

import Header from "@/components/layout/Header";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  Package,
  ShoppingCart,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { shortCOP, formatNumber } from "@/lib/utils";
import {
  inventoryItems,
  ordersData,
  suppliersData,
  operationsKPIs,
  orderFulfillment,
} from "@/lib/mockData";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const statusConfig = {
  entregado: { label: "Entregado", color: "text-[#1A8A3C]", bg: "bg-[#E8F8ED]", icon: CheckCircle2 },
  en_transito: { label: "En tránsito", color: "text-[#0071E3]", bg: "bg-[#E8F1FC]", icon: Truck },
  procesando: { label: "Procesando", color: "text-[#B45309]", bg: "bg-[#FFF3E0]", icon: Clock },
  pendiente: { label: "Pendiente", color: "text-[#6E6E73]", bg: "bg-[#F5F5F7]", icon: AlertTriangle },
};

const stockStatus = {
  normal: { label: "Normal", color: "text-[#1A8A3C]", bg: "bg-[#E8F8ED]" },
  bajo: { label: "Bajo Stock", color: "text-[#B45309]", bg: "bg-[#FFF3E0]" },
  critico: { label: "Crítico", color: "text-[#CC2929]", bg: "bg-[#FEECEB]" },
};

export default function OperacionesPage() {
  const totalInventoryValue = inventoryItems.reduce((a, b) => a + b.valor, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Módulo Operaciones"
        subtitle="Inventario · Pedidos · Proveedores"
      />

      <div className="flex-1 p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Pedidos del Mes"
            value={formatNumber(operationsKPIs.pedidosMes)}
            change={operationsKPIs.pedidosCambio}
            icon={ShoppingCart}
            iconColor="text-[#0071E3]"
            iconBg="bg-[#E8F1FC]"
            subtitle="vs. mes anterior"
          />
          <MetricCard
            title="Tasa Cumplimiento"
            value={`${operationsKPIs.tasaCumplimiento}%`}
            change={operationsKPIs.tasaCumplimientoCambio}
            icon={CheckCircle2}
            iconColor="text-[#34C759]"
            iconBg="bg-[#E8F8ED]"
            subtitle="Pedidos entregados a tiempo"
          />
          <MetricCard
            title="Valor Inventario"
            value={shortCOP(operationsKPIs.valorInventario)}
            change={operationsKPIs.inventarioCambio}
            icon={Package}
            iconColor="text-[#AF52DE]"
            iconBg="bg-[#F4EAFD]"
            subtitle="Costo de inventario"
          />
          <MetricCard
            title="T. Entrega Prom."
            value={`${operationsKPIs.tiempoEntregaPromedio} días`}
            change={operationsKPIs.tiempoEntregaCambio}
            icon={Clock}
            iconColor="text-[#FF9F0A]"
            iconBg="bg-[#FFF3E0]"
            subtitle="Mejora del 8.5% este mes"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Order Fulfillment Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
            <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-1">
              Pedidos & Cumplimiento
            </h3>
            <p className="text-[12px] text-[#6E6E73] mb-5">Ene – Jun 2024</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={orderFulfillment} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #E8E8ED", borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="pedidos" name="Total Pedidos" fill="#E8F1FC" radius={[4, 4, 0, 0]} />
                <Bar dataKey="entregados" name="Entregados" fill="#0071E3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fulfillment Rate Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
            <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-1">
              Tasa de Cumplimiento
            </h3>
            <p className="text-[12px] text-[#6E6E73] mb-5">Tendencia mensual (%)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={orderFulfillment} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                <YAxis domain={[90, 100]} tick={{ fontSize: 10, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #E8E8ED", borderRadius: 12, fontSize: 12 }}
                  formatter={(v) => [`${v}%`, "Cumplimiento"]}
                />
                <Line
                  type="monotone"
                  dataKey="tasa"
                  stroke="#34C759"
                  strokeWidth={2.5}
                  dot={{ fill: "#34C759", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Control de Inventario</h3>
              <p className="text-[12px] text-[#6E6E73]">
                {inventoryItems.length} productos · Valor total: {shortCOP(totalInventoryValue)}
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors">
              Ver completo <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F5F5F7]">
                  {["ID", "Producto", "Categoría", "Stock", "Mínimo", "Valor", "Estado"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[#AEAEB2] uppercase tracking-wider pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => {
                  const status = stockStatus[item.estado as keyof typeof stockStatus];
                  const stockPct = Math.min((item.stock / (item.minimo * 3)) * 100, 100);
                  return (
                    <tr key={item.id} className="border-b border-[#F9F9FB] hover:bg-[#F9F9FB] transition-colors">
                      <td className="py-3 pr-4 text-[11px] text-[#AEAEB2] font-mono">{item.id}</td>
                      <td className="py-3 pr-4 text-[13px] font-medium text-[#1D1D1F]">{item.producto}</td>
                      <td className="py-3 pr-4 text-[12px] text-[#6E6E73]">{item.categoria}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-[#1D1D1F]">{item.stock}</span>
                          <div className="w-16 h-1.5 bg-[#F0F0F5] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${stockPct}%`,
                                backgroundColor: item.estado === "critico" ? "#FF3B30" : item.estado === "bajo" ? "#FF9F0A" : "#34C759",
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-[12px] text-[#6E6E73]">{item.minimo}</td>
                      <td className="py-3 pr-4 text-[12px] font-medium text-[#1D1D1F]">{shortCOP(item.valor)}</td>
                      <td className="py-3">
                        <span className={`text-[11px] font-medium px-2 py-1 rounded-lg ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders & Suppliers Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
            <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-5">Pedidos Activos</h3>
            <div className="space-y-3">
              {ordersData.map((order) => {
                const status = statusConfig[order.estado as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-[#F9F9FB] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${status.bg} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon size={14} className={status.color} />
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-[#1D1D1F]">{order.cliente}</p>
                        <p className="text-[10px] text-[#AEAEB2]">{order.id} · {order.items} items · {order.fecha}</p>
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

          {/* Suppliers */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-semibold text-[#1D1D1F]">Proveedores</h3>
              <span className="text-[11px] bg-[#F5F5F7] text-[#6E6E73] px-2 py-1 rounded-lg">
                {operationsKPIs.proveedoresActivos} activos
              </span>
            </div>
            <div className="space-y-4">
              {suppliersData.map((sup) => (
                <div key={sup.id} className="p-4 bg-[#F9F9FB] rounded-xl border border-[#F0F0F5]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[13px] font-medium text-[#1D1D1F]">{sup.nombre}</p>
                      <p className="text-[11px] text-[#6E6E73]">{sup.categoria}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-[#FF9F0A] fill-[#FF9F0A]" />
                      <span className="text-[12px] font-semibold text-[#1D1D1F]">{sup.calificacion}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6E6E73]">
                    <span>Entrega: {sup.tiempoEntrega} días</span>
                    {sup.pedidosPendientes > 0 ? (
                      <span className="text-[#0071E3] font-medium">
                        {sup.pedidosPendientes} pedido{sup.pedidosPendientes > 1 ? "s" : ""} pendiente · {shortCOP(sup.valorPendiente)}
                      </span>
                    ) : (
                      <span className="text-[#34C759] font-medium">Sin pedidos pendientes</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
