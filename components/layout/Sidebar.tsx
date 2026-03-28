"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, TrendingUp, Package, Truck, Bot,
  MessageSquare, Landmark, FileText, Timer,
  Settings, HelpCircle, Building2,
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
        "flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13.5px] font-medium transition-all duration-150 group relative",
        isActive
          ? "text-white"
          : "text-[#94A3B8] hover:text-white hover:bg-white/[0.06]"
      )}
      style={isActive ? { background: "rgba(255,255,255,0.12)" } : {}}
    >
      <item.icon
        size={17}
        className={cn(
          "flex-shrink-0 transition-colors",
          isActive ? "text-white" : "text-[#64748B] group-hover:text-[#CBD5E1]"
        )}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px]"
          style={
            isActive
              ? { background: "rgba(255,255,255,0.2)", color: "white" }
              : { background: "rgba(99,179,237,0.15)", color: "#63B3ED" }
          }
        >
          {item.badge}
        </span>
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
      className="fixed left-0 top-0 h-screen flex flex-col z-40"
      style={{ background: "#0F172A", width: "260px", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#2563EB,#60A5FA)" }}
          >
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white leading-tight">PYME.ai</p>
            <p className="text-[11px] leading-tight" style={{ color: "#64748B" }}>Asistente Empresarial</p>
          </div>
        </div>
      </div>

      {/* Company badge */}
      <div className="px-4 mx-1 mb-5">
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px]"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(37,99,235,0.25)" }}
          >
            <Building2 size={13} style={{ color: "#60A5FA" }} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-white truncate">Dist. El Progreso</p>
            <p className="text-[10px]" style={{ color: "#64748B" }}>Demo · Plan Empresarial</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-0.5">
        {/* Main */}
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#334155" }}>
          Principal
        </p>
        {mainNav.map((item) => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href)} />
        ))}

        {/* Divider */}
        <div className="my-3 mx-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        {/* Tools */}
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#334155" }}>
          Herramientas
        </p>
        {toolsNav.map((item) => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="space-y-0.5 mb-3">
          {bottomNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] transition-colors hover:bg-white/[0.06]"
              style={{ color: "#64748B" }}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
        </div>

        {/* User */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px]"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white"
            style={{ background: "linear-gradient(135deg,#2563EB,#60A5FA)" }}
          >
            A
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-white">Admin</p>
            <p className="text-[10px]" style={{ color: "#64748B" }}>Modo Demo</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
