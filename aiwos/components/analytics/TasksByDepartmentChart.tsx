import type { DepartmentTaskStat } from "@/lib/api/analytics";

// Cycles through a fixed palette so colors are consistent and brand-aligned
const DEPT_COLORS = [
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ef4444", // red
  "#ec4899", // pink
  "#3b82f6", // blue
  "#14b8a6", // teal
];

interface TasksByDepartmentChartProps {
  data: DepartmentTaskStat[];
  isLoading?: boolean;
}

export function TasksByDepartmentChart({
  data,
  isLoading,
}: TasksByDepartmentChartProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-lg border p-6 min-h-[300px] animate-pulse"
        style={{
          background: "var(--card)",
          borderColor: "var(--border-light)",
        }}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="rounded-lg border p-6 flex items-center justify-center min-h-[300px]"
        style={{
          background: "var(--card)",
          borderColor: "var(--border-light)",
        }}
      >
        <p className="text-sm text-muted-foreground">No department data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.tasks, 0);
  const maxTasks = Math.max(...data.map((d) => d.tasks), 1);

  return (
    <div
      className="rounded-lg border p-6"
      style={{
        background: "var(--card)",
        borderColor: "var(--border-light)",
      }}
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Tasks by Department
      </h3>
      <div className="space-y-4">
        {data.map((dept, index) => {
          const color = DEPT_COLORS[index % DEPT_COLORS.length];
          const barWidth = (dept.tasks / maxTasks) * 100;

          return (
            <div key={dept.department}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  {dept.department}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {dept.tasks} ({dept.percentage.toFixed(1)}%)
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full"
                style={{ background: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${barWidth}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div
        className="mt-6 border-t pt-4"
        style={{ borderColor: "var(--border-light)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Total Tasks</span>
          <span className="text-lg font-bold text-foreground">{total}</span>
        </div>
        {data.length > 1 && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Avg per Dept</span>
            <span className="text-lg font-bold text-foreground">
              {(total / data.length).toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
