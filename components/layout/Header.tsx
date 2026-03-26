"use client";

import { Bell, Search, Upload } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-[#E8E8ED] sticky top-0 z-30 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F]">{title}</h1>
          {subtitle && (
            <p className="text-[13px] text-[#6E6E73] mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AEAEB2]"
            />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-9 pr-4 py-2 bg-[#F5F5F7] border border-transparent rounded-xl text-[13px] text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all w-52"
            />
          </div>

          {/* Upload button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0071E3] text-white text-[13px] font-medium rounded-xl hover:bg-[#0077ED] transition-colors shadow-sm">
            <Upload size={14} />
            <span>Importar datos</span>
          </button>

          {/* Notifications */}
          <button className="relative w-9 h-9 bg-[#F5F5F7] rounded-xl flex items-center justify-center hover:bg-[#E8E8ED] transition-colors">
            <Bell size={17} className="text-[#3D3D3D]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF3B30] rounded-full border-2 border-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
