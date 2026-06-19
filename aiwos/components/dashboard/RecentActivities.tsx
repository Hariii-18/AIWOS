import type { ActivityItem } from "@/lib/api/analytics";

const STATUS_COLORS: Record<string, string> = {
  completed: "var(--green)",
  failed: "var(--red)",
  running: "var(--cyan)",
  pending: "var(--amber)",
  cancelled: "var(--faint)",
};

function timeAgo(isoTimestamp: string): string {
  const diff = Date.now() - new Date(isoTimestamp).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

interface RecentActivitiesProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

export function RecentActivities({ activities, isLoading }: RecentActivitiesProps) {
  return (
    <div
      className="max-h-[500px] overflow-y-auto rounded-xl border p-5"
      style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          Recent Activities
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--green)" }}
          />
          Live
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 py-2.5"
              style={{
                borderBottom: i < 5 ? "1px solid var(--border-light)" : "none",
              }}
            >
              <div className="mt-[5px] h-2 w-2 shrink-0 animate-pulse rounded-full bg-[var(--border)]" />
              <div className="flex-1">
                <div className="mb-1 h-3 w-3/4 animate-pulse rounded bg-[var(--border)]" />
                <div className="h-2.5 w-1/2 animate-pulse rounded bg-[var(--border)]" />
              </div>
              <div className="h-2.5 w-12 animate-pulse rounded bg-[var(--border)]" />
            </div>
          ))}
        </div>
      ) : !activities || activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground">No activity yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Execute tasks to see the live feed here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {activities.map((item, idx) => {
            const color = STATUS_COLORS[item.status] ?? "var(--faint)";
            return (
              <div
                key={item.id}
                className="flex items-start gap-2.5 py-2.5"
                style={{
                  borderBottom:
                    idx < activities.length - 1
                      ? "1px solid var(--border-light)"
                      : "none",
                }}
              >
                <span
                  className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
                  style={{ background: color }}
                />
                <p className="flex-1 text-[13px] text-muted-foreground">
                  {item.agent_name ? (
                    <strong className="font-medium text-foreground">
                      {item.agent_name}
                    </strong>
                  ) : (
                    <strong className="font-medium text-foreground">
                      Agent
                    </strong>
                  )}{" "}
                  {item.action}
                  {item.task_title && (
                    <span className="text-foreground/70">
                      {" "}— {item.task_title}
                    </span>
                  )}
                </p>
                <span
                  className="shrink-0 whitespace-nowrap text-[11px]"
                  style={{ color: "var(--faint)" }}
                >
                  {timeAgo(item.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
