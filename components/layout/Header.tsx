import { Bell, Search, Upload } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-8 py-5 bg-white"
      style={{ borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 30 }}
    >
      <div>
        <h1 className="text-[21px] font-semibold leading-tight" style={{ color: "#0F172A" }}>{title}</h1>
        {subtitle && (
          <p className="text-[13px] mt-0.5" style={{ color: "#94A3B8" }}>{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            placeholder="Buscar..."
            className="pl-9 pr-4 py-2 text-[13px] rounded-[8px] outline-none transition-all"
            style={{
              background: "#F1F5F9",
              border: "1px solid transparent",
              color: "#0F172A",
              width: "200px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.border = "1px solid #2563EB";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = "#F1F5F9";
              e.currentTarget.style.border = "1px solid transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Import button */}
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-medium text-white transition-all btn-press"
          style={{ background: "#2563EB" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
        >
          <Upload size={14} />
          Importar datos
        </button>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-[8px] transition-colors"
          style={{ color: "#64748B" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#DC2626" }}
          />
        </button>
      </div>
    </header>
  );
}
