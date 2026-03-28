"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, TrendingUp, Package, Truck, Bot,
  MessageSquare, Landmark, FileText, Timer,
  Settings, HelpCircle, Building2, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { label: "Dashboard",    href: "/",           icon: LayoutDashboard },
  { label: "Finanzas",     href: "/finanzas",   icon: TrendingUp },
  { label: "Operaciones",  href: "/operaciones",icon: Package },
  { label: "Logística",    href: "/logistica",  icon: Truck },
  { label: "Asistente IA", href: "/asistente",  icon: Bot, badge: "IA" },
];

const toolsNav = [
  { label: "WhatsApp",      href: "/whatsapp",     icon: MessageSquare, badge: "Nuevo" },
  { label: "Conciliación",  href: "/conciliacion", icon: Landmark },
  { label: "Documentos",    href: "/documentos",   icon: FileText },
  { label: "Jobs",          href: "/admin/jobs",   icon: Timer },
];

const bottomNav = [
  { label: "Configuración", href: "/configuracion", icon: Settings },
  { label: "Ayuda",         href: "/ayuda",         icon: HelpCircle },
];

function NavItem({
  item,
  isActive,
}: {
  item: { label: string; href: string; icon: React.ElementType; badge?: string };
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium transition-all duration-150 group relative",
        isActive
          ? "bg-[#F0F4FF] text-[#0066CC]"
          : "text-[#3D3D3D] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
      )}
    >
      <item.icon
        size={18}
        className={cn(
          "flex-shrink-0 transition-colors",
          isActive ? "text-[#0066CC]" : "text-[#6E6E73] group-hover:text-[#1D1D1F]"
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span
          className={cn(
            "text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]",
            isActive
              ? "bg-[#0066CC] text-white"
              : "bg-[#F0F4FF] text-[#0066CC]"
          )}
        >
          {item.badge}
        </span>
      )}
      {isActive && (
        <ChevronRight size={12} className="text-[#0066CC] opacity-60" />
      )}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-white flex flex-col z-40"
      style={{ borderRight: "1px solid #F0F0F0", width: "260px" }}
    >
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: "#0066CC" }}
          >
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1D1D1F] leading-tight">PYME.ai</p>
            <p className="text-[11px] text-[#AEAEB2] leading-tight">Asistente Empresarial</p>
          </div>
        </div>
      </div>

      {/* Company badge */}
      <div className="px-4 mx-2 mb-4">
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px]"
          style={{ background: "#F5F5F7" }}
        >
          <div
            className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
            style={{ background: "#F0F4FF" }}
          >
            <Building2 size={13} className="text-[#0066CC]" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-[#1D1D1F] truncate">Dist. El Progreso</p>
            <p className="text-[10px] text-[#AEAEB2]">Demo · Plan Empresarial</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-0.5">
        {/* Main */}
        <p className="px-3 pb-1.5 pt-1 text-[10px] font-semibold text-[#AEAEB2] uppercase tracking-widest">
          Principal
        </p>
        {mainNav.map((item) => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href)} />
        ))}

        {/* Divider */}
        <div className="my-3" style={{ borderTop: "1px solid #F0F0F0" }} />

        {/* Tools */}
        <p className="px-3 pb-1.5 text-[10px] font-semibold text-[#AEAEB2] uppercase tracking-widest">
          Herramientas
        </p>
        {toolsNav.map((item) => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid #F0F0F0" }}>
        <div className="space-y-0.5 mb-3">
          {bottomNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F] transition-colors"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] bg-[#F5F5F7]">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white"
            style={{ background: "linear-gradient(135deg,#0066CC,#5AC8FA)" }}>
            A
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-[#1D1D1F]">Admin</p>
            <p className="text-[10px] text-[#AEAEB2]">Modo Demo</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
