import type { CompletionTrendData } from "@/lib/data/analytics";

interface TaskCompletionTrendChartProps {
  data: CompletionTrendData[];
}

export function TaskCompletionTrendChart({
  data,
}: TaskCompletionTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="rounded-lg border p-6 flex items-center justify-center min-h-[300px]"
        style={{
          background: "var(--card)",
          borderColor: "var(--border-light)",
        }}
      >
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  const maxTotal = Math.max(...data.map((d) => d.total));
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 40;

  const pointsCompleted = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - (d.completed / maxTotal) * (chartHeight - padding) + 20;
    return { x, y, value: d.completed };
  });

  const pointsTotal = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - (d.total / maxTotal) * (chartHeight - padding) + 20;
    return { x, y, value: d.total };
  });

  const pathCompleted = pointsCompleted
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const pathTotal = pointsTotal
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div
      className="rounded-lg border p-6"
      style={{
        background: "var(--card)",
        borderColor: "var(--border-light)",
      }}
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Task Completion Trend
      </h3>
      <div className="flex flex-col">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
          className="w-full"
          style={{ minHeight: "300px" }}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`grid-${i}`}
              x1={padding}
              y1={20 + (i * (chartHeight - padding)) / 4}
              x2={chartWidth - padding}
              y2={20 + (i * (chartHeight - padding)) / 4}
              stroke="var(--border-light)"
              strokeDasharray="4"
              opacity="0.5"
            />
          ))}

          {/* Total line */}
          <path
            d={pathTotal}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Completed line */}
          <path
            d={pathCompleted}
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="3"
          />

          {/* Points for completed */}
          {pointsCompleted.map((p, i) => (
            <circle
              key={`completed-${i}`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="var(--cyan)"
            />
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={`label-${i}`}
              x={
                (i / (data.length - 1 || 1)) * (chartWidth - padding * 2) +
                padding
              }
              y={chartHeight + 35}
              textAnchor="middle"
              fontSize="12"
              fill="var(--muted-foreground)"
            >
              {d.date}
            </text>
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={`y-label-${i}`}
              x={padding - 10}
              y={20 + (i * (chartHeight - padding)) / 4 + 4}
              textAnchor="end"
              fontSize="12"
              fill="var(--muted-foreground)"
            >
              {Math.round(maxTotal - (maxTotal * i) / 4)}
            </text>
          ))}
        </svg>

        {/* Legend */}
        <div className="mt-4 flex gap-6">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-6 rounded"
              style={{ background: "var(--cyan)" }}
            />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-6 rounded"
              style={{ background: "var(--muted-foreground)", opacity: 0.5 }}
            />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
