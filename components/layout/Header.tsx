import { Bell, Search, Upload } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-8 py-5 bg-white"
      style={{ borderBottom: "1px solid #F0F0F0", position: "sticky", top: 0, zIndex: 30 }}
    >
      <div>
        <h1 className="text-[22px] font-semibold text-[#1D1D1F] leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-[13px] text-[#6E6E73] mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AEAEB2]" />
          <input
            placeholder="Buscar..."
            className="pl-9 pr-4 py-2 text-[13px] rounded-[8px] outline-none transition-all"
            style={{
              background: "#F5F5F7",
              border: "1px solid transparent",
              color: "#1D1D1F",
              width: "200px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.border = "1px solid #0066CC";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = "#F5F5F7";
              e.currentTarget.style.border = "1px solid transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Import button */}
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-medium text-white transition-all btn-press"
          style={{ background: "#0066CC" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0077ED")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#0066CC")}
        >
          <Upload size={14} />
          Importar datos
        </button>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-[8px] transition-colors hover:bg-[#F5F5F7]"
          style={{ color: "#6E6E73" }}
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#FF3B30" }}
          />
        </button>
      </div>
    </header>
  );
}
