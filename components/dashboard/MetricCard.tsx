import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  loading?: boolean;
}

export function MetricCardSkeleton() {
  return (
    <div
      className="bg-white rounded-[16px] p-6"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton w-8 h-8 rounded-[8px]" />
        <div className="skeleton w-14 h-5 rounded-full" />
      </div>
      <div className="skeleton w-24 h-8 mb-2 rounded-[6px]" />
      <div className="skeleton w-32 h-4 rounded-[4px]" />
    </div>
  );
}

export default function MetricCard({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
  iconColor = "#0066CC",
  iconBg = "#F0F4FF",
  loading = false,
}: MetricCardProps) {
  if (loading) return <MetricCardSkeleton />;

  const isPositive = change !== undefined && change >= 0;
  const hasChange = change !== undefined;

  return (
    <div
      className="bg-white rounded-[16px] p-6 transition-all duration-200 group cursor-default"
      style={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 24px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 8px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: iconBg }}
          >
            <Icon size={17} style={{ color: iconColor }} />
          </div>
        )}
        {hasChange && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[12px] font-medium"
            style={{
              background: isPositive ? "#F0FBF4" : "#FFF1F0",
              color: isPositive ? "#1A8A3C" : "#C4302A",
            }}
          >
            {isPositive ? (
              <TrendingUp size={11} />
            ) : (
              <TrendingDown size={11} />
            )}
            {isPositive ? "+" : ""}{change?.toFixed(1)}%
          </div>
        )}
      </div>

      <p
        className="font-semibold leading-tight mb-1"
        style={{ fontSize: "30px", color: "#1D1D1F", letterSpacing: "-0.5px" }}
      >
        {value}
      </p>

      <p className="text-[13px] font-medium text-[#6E6E73]">{title}</p>

      {subtitle && (
        <p className="text-[11px] text-[#AEAEB2] mt-1">{subtitle}</p>
      )}
    </div>
  );
}
