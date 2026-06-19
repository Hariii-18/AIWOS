import type { WeeklyCompletion } from "@/lib/api/analytics";

const CHART_W = 560;
const CHART_H = 155;
const PAD_TOP = 20;
const PAD_BOTTOM = 20;

function buildPath(points: [number, number][]): string {
  if (points.length === 0) return "";
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
}

interface TaskCompletionChartProps {
  weeklyData?: WeeklyCompletion[];
  isLoading?: boolean;
}

export function TaskCompletionChart({
  weeklyData,
  isLoading,
}: TaskCompletionChartProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-xl border p-5"
        style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="h-4 w-48 animate-pulse rounded bg-[var(--border)]" />
          <div className="h-3 w-16 animate-pulse rounded bg-[var(--border)]" />
        </div>
        <div
          className="animate-pulse rounded-lg bg-[var(--border)]"
          style={{ height: 160 }}
        />
      </div>
    );
  }

  const data = weeklyData ?? [];
  const maxVal = Math.max(...data.map((d) => d.completed), 1);
  const step = CHART_W / Math.max(data.length - 1, 1);

  const points: [number, number][] = data.map((d, i) => {
    const x = i * step;
    const y =
      CHART_H -
      PAD_BOTTOM -
      ((d.completed / maxVal) * (CHART_H - PAD_TOP - PAD_BOTTOM));
    return [Math.round(x), Math.round(y)];
  });

  const linePath = buildPath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L${CHART_W},${CHART_H} L0,${CHART_H} Z`
      : "";

  const totalCompleted = data.reduce((s, d) => s + d.completed, 0);

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          Task Completion (This Week)
        </span>
        <span className="text-xs text-muted-foreground">
          {totalCompleted} completed
        </span>
      </div>

      <div style={{ height: 160, padding: "0 4px" }}>
        {data.length === 0 || totalCompleted === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No completed tasks this week
          </div>
        ) : (
          <svg
            width="100%"
            height="160"
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="none"
            overflow="visible"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {[32, 64, 96, 128].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2={CHART_W}
                y2={y}
                stroke="var(--border)"
                strokeWidth="1"
              />
            ))}

            {areaPath && (
              <path d={areaPath} fill="url(#chartGrad)" />
            )}

            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {points.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4" fill="#7c3aed" />
            ))}

            {data.map((d, i) => (
              <text
                key={d.date}
                x={i * step}
                y={CHART_H + 4}
                fill="var(--faint)"
                fontSize="11"
                fontFamily="inherit"
                textAnchor="middle"
              >
                {d.date}
              </text>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}
