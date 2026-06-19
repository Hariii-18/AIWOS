import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { TopAgentStat } from "@/lib/api/analytics";

const SCORE_COLORS = [
  "var(--purple)",
  "var(--cyan)",
  "var(--green)",
  "var(--amber)",
  "var(--pink)",
];

interface TopAgentsProps {
  agents?: TopAgentStat[];
  isLoading?: boolean;
}

export function TopAgents({ agents, isLoading }: TopAgentsProps) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          Top Performing Agents
        </span>
        <Link
          href="/agents"
          className="flex items-center gap-1 text-xs transition-colors hover:underline"
          style={{ color: "var(--purple)" }}
        >
          View All <ChevronRight size={12} />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-36 animate-pulse rounded bg-[var(--border)]" />
              <div className="h-[5px] flex-1 animate-pulse rounded-full bg-[var(--border)]" />
              <div className="h-3 w-9 animate-pulse rounded bg-[var(--border)]" />
            </div>
          ))}
        </div>
      ) : !agents || agents.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No agent execution data yet. Run tasks to see rankings.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {agents.map((agent, i) => {
            const color = SCORE_COLORS[i % SCORE_COLORS.length];
            return (
              <div key={agent.id} className="flex items-center gap-2">
                <span className="w-36 shrink-0 truncate text-[13px] text-foreground">
                  {agent.name}
                </span>
                <div
                  className="h-[5px] flex-1 overflow-hidden rounded-full"
                  style={{ background: "var(--border)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${agent.success_rate}%`, background: color }}
                  />
                </div>
                <span className="w-9 text-right text-[13px] font-semibold text-foreground">
                  {agent.success_rate}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
