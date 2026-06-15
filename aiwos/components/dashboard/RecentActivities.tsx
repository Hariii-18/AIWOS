import { recentActivities } from "@/lib/data/dashboard";

export function RecentActivities() {
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

      <div className="flex flex-col">
        {recentActivities.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-start gap-2.5 py-2.5"
            style={{
              borderBottom:
                idx < recentActivities.length - 1
                  ? "1px solid var(--border-light)"
                  : "none",
            }}
          >
            <span
              className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
              style={{ background: item.color }}
            />
            <p className="flex-1 text-[13px] text-muted-foreground">
              <strong className="font-medium text-foreground">
                {item.agent}
              </strong>{" "}
              {item.action}
            </p>
            <span
              className="shrink-0 whitespace-nowrap text-[11px]"
              style={{ color: "var(--faint)" }}
            >
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
