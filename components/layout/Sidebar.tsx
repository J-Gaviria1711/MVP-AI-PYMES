"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Truck,
  Bot,
  ChevronRight,
  Building2,
  Settings,
  HelpCircle,
  MessageSquare,
  Landmark,
  FileText,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Finanzas",
    href: "/finanzas",
    icon: TrendingUp,
  },
  {
    label: "Operaciones",
    href: "/operaciones",
    icon: Package,
  },
  {
    label: "Logística",
    href: "/logistica",
    icon: Truck,
  },
  {
    label: "Asistente IA",
    href: "/asistente",
    icon: Bot,
    badge: "IA",
  },
];

const phase2Items = [
  { label: "WhatsApp", href: "/whatsapp", icon: MessageSquare, badge: "Nuevo" },
  { label: "Conciliación", href: "/conciliacion", icon: Landmark },
  { label: "Documentos", href: "/documentos", icon: FileText },
  { label: "Jobs Automáticos", href: "/admin/jobs", icon: Timer },
];

const bottomItems = [
  { label: "Configuración", href: "/configuracion", icon: Settings },
  { label: "Ayuda", href: "/ayuda", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{ width: "260px" }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-[#E8E8ED] flex flex-col z-40 shadow-sm"
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#E8E8ED]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0071E3] flex items-center justify-center shadow-sm">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#1D1D1F] leading-tight">PYME.ai</p>
            <p className="text-[11px] text-[#6E6E73] leading-tight">Asistente Empresarial</p>
          </div>
        </div>
      </div>

      {/* Company */}
      <div className="px-4 py-3 mx-3 mt-4 bg-[#F5F5F7] rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8F1FC] flex items-center justify-center flex-shrink-0">
            <Building2 size={14} className="text-[#0071E3]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#1D1D1F] truncate">Dist. El Progreso</p>
            <p className="text-[10px] text-[#6E6E73]">Demo · Plan Empresarial</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-[#AEAEB2] uppercase tracking-wider px-3 mb-2">
          Módulos
        </p>
        {[...navItems, ...phase2Items].map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group",
                isActive
                  ? "bg-[#0071E3] text-white shadow-sm"
                  : "text-[#3D3D3D] hover:bg-[#F5F5F7]"
              )}
            >
              <item.icon
                size={17}
                className={cn(
                  "flex-shrink-0",
                  isActive ? "text-white" : "text-[#6E6E73] group-hover:text-[#0071E3]"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#E8F1FC] text-[#0071E3]"
                  )}
                >
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight size={13} className="text-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[#E8E8ED] space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] transition-all"
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0071E3] to-[#5AC8FA] flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-white">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-[#1D1D1F] truncate">Admin</p>
            <p className="text-[10px] text-[#6E6E73]">Modo Demo</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
