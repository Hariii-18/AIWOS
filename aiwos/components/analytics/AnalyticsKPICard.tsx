interface AnalyticsKPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
}

export function AnalyticsKPICard({
  title,
  value,
  unit,
  trend = "neutral",
  trendValue,
}: AnalyticsKPICardProps) {
  let trendColor = "var(--muted-foreground)";
  if (trend === "up") trendColor = "var(--green)";
  if (trend === "down") trendColor = "var(--red)";

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        background: "var(--card)",
        borderColor: "var(--border-light)",
      }}
    >
      <p className="text-xs text-muted-foreground">{title}</p>
      <div className="mt-3 flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {unit && <p className="text-sm text-muted-foreground">{unit}</p>}
        </div>
        {trendValue !== undefined && (
          <div
            className="text-xs font-semibold"
            style={{ color: trendColor }}
          >
            {trend === "up" && "+"}
            {trendValue}%
          </div>
        )}
      </div>
    </div>
  );
}
