import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { topAgents } from "@/lib/data/dashboard";

export function TopAgents() {
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

      <div className="flex flex-col gap-3">
        {topAgents.map((agent) => (
          <div key={agent.name} className="flex items-center gap-2">
            <span className="w-36 shrink-0 text-[13px] text-foreground">
              {agent.name}
            </span>
            <div
              className="h-[5px] flex-1 overflow-hidden rounded-full"
              style={{ background: "var(--border)" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${agent.score}%`, background: agent.color }}
              />
            </div>
            <span className="w-9 text-right text-[13px] font-semibold text-foreground">
              {agent.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
