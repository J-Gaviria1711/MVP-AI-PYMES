"use client";

import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

export default function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-[#0071E3]",
  iconBg = "bg-[#E8F1FC]",
  subtitle,
  trend,
}: MetricCardProps) {
  const isPositive = change !== undefined ? change >= 0 : trend === "up";
  const isNeutral = change === 0 || trend === "neutral";

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#F0F0F5] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            iconBg
          )}
        >
          <Icon size={20} className={iconColor} />
        </div>
        {change !== undefined && !isNeutral && (
          <div
            className={cn(
              "flex items-center gap-1 text-[12px] font-semibold px-2 py-1 rounded-lg",
              isPositive
                ? "bg-[#E8F8ED] text-[#1A8A3C]"
                : "bg-[#FEECEB] text-[#CC2929]"
            )}
          >
            {isPositive ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      <p className="text-[13px] text-[#6E6E73] font-medium mb-1">{title}</p>
      <p className="text-2xl font-semibold text-[#1D1D1F] tracking-tight leading-tight">
        {value}
      </p>
      {subtitle && (
        <p className="text-[11px] text-[#AEAEB2] mt-1">{subtitle}</p>
      )}
    </div>
  );
}
