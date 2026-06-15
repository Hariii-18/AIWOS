import type { DepartmentTaskData } from "@/lib/data/analytics";

interface TasksByDepartmentChartProps {
  data: DepartmentTaskData[];
}

export function TasksByDepartmentChart({
  data,
}: TasksByDepartmentChartProps) {
  const total = data.reduce((sum, d) => sum + d.tasks, 0);
  const maxTasks = Math.max(...data.map((d) => d.tasks));

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
        {data.map((dept) => {
          const percentage = (dept.tasks / total) * 100;
          const barWidth = (dept.tasks / maxTasks) * 100;

          return (
            <div key={dept.department}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  {dept.department}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {dept.tasks} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full"
                style={{ background: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${barWidth}%`,
                    background: dept.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--border-light)" }}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Total Tasks</span>
          <span className="text-lg font-bold text-foreground">{total}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Average per Dept</span>
          <span className="text-lg font-bold text-foreground">
            {(total / data.length).toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
