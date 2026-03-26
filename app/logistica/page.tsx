"use client";

import Header from "@/components/layout/Header";
import MetricCard from "@/components/dashboard/MetricCard";
import { Truck, MapPin, Clock, Package, CheckCircle2, AlertCircle, Navigation } from "lucide-react";
import { shortCOP, formatNumber } from "@/lib/utils";
import { ordersData, suppliersData, operationsKPIs } from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const deliveryZones = [
  { zona: "Bogotá Norte", pedidos: 32, entregados: 31, tiempo: 1.2 },
  { zona: "Bogotá Sur", pedidos: 18, entregados: 17, tiempo: 1.8 },
  { zona: "Bogotá Centro", pedidos: 14, entregados: 13, tiempo: 1.5 },
  { zona: "Soacha", pedidos: 8, entregados: 7, tiempo: 2.5 },
  { zona: "Chía / Cajicá", pedidos: 11, entregados: 10, tiempo: 2.1 },
  { zona: "Otras ciudades", pedidos: 6, entregados: 6, tiempo: 4.8 },
];

const shipmentMethods = [
  { method: "Transportadora propia", pedidos: 45, color: "#0071E3" },
  { method: "Servientrega", pedidos: 22, color: "#5AC8FA" },
  { method: "Coordinadora", pedidos: 15, color: "#34C759" },
  { method: "Envío por terceros", pedidos: 7, color: "#FF9F0A" },
];

export default function LogisticaPage() {
  const enTransito = ordersData.filter((o) => o.estado === "en_transito").length;
  const pendientes = ordersData.filter((o) => o.estado === "pendiente").length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Módulo Logística"
        subtitle="Envíos · Rutas · Trazabilidad"
      />

      <div className="flex-1 p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="En Tránsito"
            value={formatNumber(enTransito)}
            icon={Truck}
            iconColor="text-[#0071E3]"
            iconBg="bg-[#E8F1FC]"
            subtitle="Envíos activos"
          />
          <MetricCard
            title="Tiempo Entrega"
            value={`${operationsKPIs.tiempoEntregaPromedio} días`}
            change={operationsKPIs.tiempoEntregaCambio}
            icon={Clock}
            iconColor="text-[#34C759]"
            iconBg="bg-[#E8F8ED]"
            subtitle="Promedio último mes"
          />
          <MetricCard
            title="Pendientes"
            value={formatNumber(pendientes)}
            icon={Package}
            iconColor="text-[#FF9F0A]"
            iconBg="bg-[#FFF3E0]"
            subtitle="Por despachar"
          />
          <MetricCard
            title="Cobertura"
            value="6 zonas"
            icon={MapPin}
            iconColor="text-[#AF52DE]"
            iconBg="bg-[#F4EAFD]"
            subtitle="Bogotá + alrededores"
          />
        </div>

        {/* Delivery Zones */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
            <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-1">Pedidos por Zona</h3>
            <p className="text-[12px] text-[#6E6E73] mb-5">Junio 2024</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deliveryZones} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="zona" type="category" tick={{ fontSize: 11, fill: "#6E6E73" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #E8E8ED", borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="pedidos" name="Pedidos" fill="#E8F1FC" radius={[0, 4, 4, 0]} />
                <Bar dataKey="entregados" name="Entregados" fill="#0071E3" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
            <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-5">Métodos de Envío</h3>
            <div className="space-y-4">
              {shipmentMethods.map((m) => {
                const total = shipmentMethods.reduce((a, b) => a + b.pedidos, 0);
                const pct = ((m.pedidos / total) * 100).toFixed(0);
                return (
                  <div key={m.method}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[12px] text-[#6E6E73]">{m.method}</span>
                      <span className="text-[12px] font-semibold text-[#1D1D1F]">
                        {m.pedidos} pedidos ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 p-4 bg-[#E8F1FC] rounded-xl">
              <p className="text-[12px] font-semibold text-[#0071E3] mb-1">Recomendación IA</p>
              <p className="text-[11px] text-[#1D1D1F]">
                El 52% de envíos usa transporte propio. Considera negociar tarifa corporativa con Servientrega para rutas de más de 50 km para reducir costos un ~18%.
              </p>
            </div>
          </div>
        </div>

        {/* Shipment Tracking */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
          <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-5">Trazabilidad de Envíos</h3>
          <div className="space-y-3">
            {ordersData.map((order) => {
              const steps = ["Procesado", "Preparado", "Despachado", "En ruta", "Entregado"];
              const stepMap: Record<string, number> = {
                pendiente: 0,
                procesando: 1,
                en_transito: 3,
                entregado: 4,
              };
              const currentStep = stepMap[order.estado] ?? 0;

              return (
                <div key={order.id} className="p-4 bg-[#F9F9FB] rounded-xl border border-[#F0F0F5]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[13px] font-medium text-[#1D1D1F]">{order.cliente}</p>
                      <p className="text-[11px] text-[#AEAEB2]">{order.id} · {order.fecha} · {shortCOP(order.valor)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {order.estado === "entregado" ? (
                        <CheckCircle2 size={14} className="text-[#34C759]" />
                      ) : order.estado === "en_transito" ? (
                        <Navigation size={14} className="text-[#0071E3]" />
                      ) : (
                        <AlertCircle size={14} className="text-[#FF9F0A]" />
                      )}
                      <span className={`text-[11px] font-medium ${
                        order.estado === "entregado" ? "text-[#1A8A3C]" :
                        order.estado === "en_transito" ? "text-[#0071E3]" : "text-[#B45309]"
                      }`}>
                        {order.estado === "entregado" ? "Entregado" : order.estado === "en_transito" ? "En tránsito" : order.estado === "procesando" ? "Preparando" : "Pendiente"}
                      </span>
                    </div>
                  </div>
                  {/* Progress steps */}
                  <div className="flex items-center gap-0">
                    {steps.map((step, i) => (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              i <= currentStep
                                ? "bg-[#0071E3] text-white"
                                : "bg-[#E8E8ED] text-[#AEAEB2]"
                            }`}
                          >
                            {i < currentStep ? "✓" : i + 1}
                          </div>
                          <span className="text-[9px] text-[#AEAEB2] mt-1 whitespace-nowrap">{step}</span>
                        </div>
                        {i < steps.length - 1 && (
                          <div
                            className="flex-1 h-0.5 mx-1 mb-4"
                            style={{ backgroundColor: i < currentStep ? "#0071E3" : "#E8E8ED" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carrier performance */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5]">
          <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-5">Performance por Zona</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F5F5F7]">
                  {["Zona", "Pedidos", "Entregados", "T. Promedio", "Tasa", "Estado"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[#AEAEB2] uppercase tracking-wider pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deliveryZones.map((zone) => {
                  const tasa = ((zone.entregados / zone.pedidos) * 100).toFixed(0);
                  const tasaNum = parseInt(tasa);
                  return (
                    <tr key={zone.zona} className="border-b border-[#F9F9FB] hover:bg-[#F9F9FB] transition-colors">
                      <td className="py-3 pr-4 text-[13px] font-medium text-[#1D1D1F]">{zone.zona}</td>
                      <td className="py-3 pr-4 text-[12px] text-[#6E6E73]">{zone.pedidos}</td>
                      <td className="py-3 pr-4 text-[12px] text-[#6E6E73]">{zone.entregados}</td>
                      <td className="py-3 pr-4 text-[12px] text-[#6E6E73]">{zone.tiempo} días</td>
                      <td className="py-3 pr-4">
                        <span className={`text-[12px] font-semibold ${tasaNum >= 95 ? "text-[#1A8A3C]" : tasaNum >= 88 ? "text-[#B45309]" : "text-[#CC2929]"}`}>
                          {tasa}%
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-[11px] font-medium px-2 py-1 rounded-lg ${
                          tasaNum >= 95 ? "bg-[#E8F8ED] text-[#1A8A3C]" :
                          tasaNum >= 88 ? "bg-[#FFF3E0] text-[#B45309]" :
                          "bg-[#FEECEB] text-[#CC2929]"
                        }`}>
                          {tasaNum >= 95 ? "Excelente" : tasaNum >= 88 ? "Regular" : "Crítico"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
