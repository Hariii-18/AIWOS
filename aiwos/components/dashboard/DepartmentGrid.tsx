import {
  Code2,
  Megaphone,
  Users,
  Coins,
  Headphones,
  Telescope,
  LayoutGrid,
  type LucideProps,
} from "lucide-react";
import type { DepartmentStat } from "@/lib/api/analytics";

const ICONS: React.ComponentType<LucideProps>[] = [
  Code2,
  Megaphone,
  Users,
  Coins,
  Headphones,
  Telescope,
  LayoutGrid,
];

const COLORS = [
  { color: "var(--purple)", bg: "rgba(124,58,237,0.12)" },
  { color: "var(--amber)", bg: "rgba(245,158,11,0.12)" },
  { color: "var(--pink)", bg: "rgba(236,72,153,0.12)" },
  { color: "var(--green)", bg: "rgba(16,185,129,0.12)" },
  { color: "var(--cyan)", bg: "rgba(6,182,212,0.12)" },
  { color: "var(--red)", bg: "rgba(239,68,68,0.12)" },
  { color: "var(--purple)", bg: "rgba(124,58,237,0.12)" },
];

function DeptCard({
  dept,
  index,
}: {
  dept: DepartmentStat;
  index: number;
}) {
  const Icon = ICONS[index % ICONS.length];
  const { color, bg } = COLORS[index % COLORS.length];
  const progress =
    dept.total_tasks > 0
      ? Math.round((dept.completed_tasks / dept.total_tasks) * 100)
      : 0;

  return (
    <div
      className="cursor-pointer rounded-xl border p-3.5 text-center transition-all duration-150 hover:border-[var(--border)]"
      style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
    >
      <div
        className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: bg, color }}
      >
        <Icon size={18} />
      </div>
      <div className="mb-1 text-xs font-medium text-foreground">
        {dept.name}
      </div>
      <div className="text-[11px] text-muted-foreground">
        {dept.agent_count} {dept.agent_count === 1 ? "Agent" : "Agents"}
      </div>
      <div
        className="mt-2 h-1 overflow-hidden rounded-full"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: color }}
        />
      </div>
    </div>
  );
}

function DeptCardSkeleton() {
  return (
    <div
      className="rounded-xl border p-3.5"
      style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
    >
      <div className="mx-auto mb-2 h-9 w-9 animate-pulse rounded-lg bg-[var(--border)]" />
      <div className="mx-auto mb-1 h-3 w-20 animate-pulse rounded bg-[var(--border)]" />
      <div className="mx-auto h-2.5 w-14 animate-pulse rounded bg-[var(--border)]" />
      <div className="mt-2 h-1 w-full animate-pulse rounded-full bg-[var(--border)]" />
    </div>
  );
}

interface DepartmentGridProps {
  departments?: DepartmentStat[];
  isLoading?: boolean;
}

export function DepartmentGrid({ departments, isLoading }: DepartmentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <DeptCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!departments || departments.length === 0) {
    return (
      <div
        className="flex h-24 items-center justify-center rounded-xl border text-sm text-muted-foreground"
        style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
      >
        No departments found. Create departments and assign agents to see an overview.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {departments.map((dept, i) => (
        <DeptCard key={dept.id} dept={dept} index={i} />
      ))}
    </div>
  );
}
