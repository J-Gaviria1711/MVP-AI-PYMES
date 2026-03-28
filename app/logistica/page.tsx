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
  { method: "Transportadora propia", pedidos: 45, color: "#0066CC" },
  { method: "Servientrega", pedidos: 22, color: "#5AC8FA" },
  { method: "Coordinadora", pedidos: 15, color: "#34C759" },
  { method: "Envío por terceros", pedidos: 7, color: "#FF9F0A" },
];

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
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function LogisticaPage() {
  const enTransito = ordersData.filter((o) => o.estado === "en_transito").length;
  const pendientes = ordersData.filter((o) => o.estado === "pendiente").length;

  return (
    <div className="page-enter flex flex-col min-h-screen">
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
            iconColor="text-[#0066CC]"
            iconBg="bg-[#E8F1FC]"
            subtitle="Envíos activos"
          />
          <MetricCard
            title="Tiempo Entrega"
            value={`${operationsKPIs.tiempoEntregaPromedio} días`}
            change={operationsKPIs.tiempoEntregaCambio}
            icon={Clock}
            iconColor="text-[#34C759]"
            iconBg="bg-[#F0FBF4]"
            subtitle="Promedio último mes"
          />
          <MetricCard
            title="Pendientes"
            value={formatNumber(pendientes)}
            icon={Package}
            iconColor="text-[#FF9F0A]"
            iconBg="bg-[#FFF8EC]"
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
          <div
            className="bg-white rounded-[16px] p-6"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
          >
            <h3 className="text-[16px] font-semibold text-[#1D1D1F] mb-1">Pedidos por Zona</h3>
            <p className="text-[12px] text-[#6E6E73] mb-5">Junio 2024</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deliveryZones} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#AEAEB2" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="zona" type="category" tick={{ fontSize: 11, fill: "#6E6E73" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pedidos" name="Pedidos" fill="#E8F1FC" radius={[0, 4, 4, 0]} />
                <Bar dataKey="entregados" name="Entregados" fill="#0066CC" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            className="bg-white rounded-[16px] p-6"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
          >
            <h3 className="text-[16px] font-semibold text-[#1D1D1F] mb-5">Métodos de Envío</h3>
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
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${pct}%`, background: m.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 p-4 rounded-[12px]" style={{ background: "#F5F5F7" }}>
              <p className="text-[12px] font-semibold text-[#0066CC] mb-1">Recomendación IA</p>
              <p className="text-[11px] text-[#1D1D1F]">
                El 52% de envíos usa transporte propio. Considera negociar tarifa corporativa con Servientrega para rutas de más de 50 km para reducir costos un ~18%.
              </p>
            </div>
          </div>
        </div>

        {/* Shipment Tracking */}
        <div
          className="bg-white rounded-[16px] p-6"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <h3 className="text-[16px] font-semibold text-[#1D1D1F] mb-5">Trazabilidad de Envíos</h3>
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
                <div key={order.id} className="p-4 rounded-[12px]" style={{ background: "#F5F5F7" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[13px] font-medium text-[#1D1D1F]">{order.cliente}</p>
                      <p className="text-[11px] text-[#AEAEB2]">{order.id} · {order.fecha} · {shortCOP(order.valor)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {order.estado === "entregado" ? (
                        <CheckCircle2 size={14} className="text-[#34C759]" />
                      ) : order.estado === "en_transito" ? (
                        <Navigation size={14} className="text-[#0066CC]" />
                      ) : (
                        <AlertCircle size={14} className="text-[#FF9F0A]" />
                      )}
                      <span className={`text-[11px] font-medium ${
                        order.estado === "entregado" ? "text-[#1A8A3C]" :
                        order.estado === "en_transito" ? "text-[#0066CC]" : "text-[#B45309]"
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
                                ? "text-white"
                                : "text-[#AEAEB2]"
                            }`}
                            style={{
                              background: i <= currentStep ? "#0066CC" : "#E8E8ED",
                            }}
                          >
                            {i < currentStep ? "✓" : i + 1}
                          </div>
                          <span className="text-[9px] text-[#AEAEB2] mt-1 whitespace-nowrap">{step}</span>
                        </div>
                        {i < steps.length - 1 && (
                          <div
                            className="flex-1 h-0.5 mx-1 mb-4"
                            style={{ backgroundColor: i < currentStep ? "#0066CC" : "#E8E8ED" }}
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
        <div
          className="bg-white rounded-[16px] p-6"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
        >
          <h3 className="text-[16px] font-semibold text-[#1D1D1F] mb-5">Performance por Zona</h3>
          <div className="overflow-x-auto">
            <table className="apple-table w-full">
              <thead>
                <tr className="border-b border-[#F0F0F0]">
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
                    <tr key={zone.zona} className="border-b border-[#F0F0F0] hover:bg-[#F5F5F7] transition-colors">
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
                        <span
                          className="inline-flex items-center"
                          style={{
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: 500,
                            background: tasaNum >= 95 ? "#F0FBF4" : tasaNum >= 88 ? "#FFF8EC" : "#FFF1F0",
                            color: tasaNum >= 95 ? "#1A8A3C" : tasaNum >= 88 ? "#B45309" : "#CC2929",
                          }}
                        >
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
