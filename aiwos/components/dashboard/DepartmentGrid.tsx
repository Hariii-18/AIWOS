import {
  Code2,
  Megaphone,
  Users,
  Coins,
  Headphones,
  Telescope,
  type LucideProps,
} from "lucide-react";
import type { Department } from "@/lib/types";
import { departments } from "@/lib/data/dashboard";

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  Code2,
  Megaphone,
  Users,
  Coins,
  Headphones,
  Telescope,
};

function DeptCard({ dept }: { dept: Department }) {
  const Icon = ICONS[dept.icon] ?? Code2;

  return (
    <div
      className="cursor-pointer rounded-xl border p-3.5 text-center transition-all duration-150 hover:border-[var(--border)]"
      style={{
        background: "var(--card)",
        borderColor: "var(--border-light)",
      }}
    >
      <div
        className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: dept.bgColor, color: dept.color }}
      >
        <Icon size={18} />
      </div>
      <div className="mb-1 text-xs font-medium text-foreground">
        {dept.name}
      </div>
      <div className="text-[11px] text-muted-foreground">
        {dept.count} Agents
      </div>
      <div
        className="mt-2 h-1 overflow-hidden rounded-full"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${dept.progress}%`, background: dept.color }}
        />
      </div>
    </div>
  );
}

export function DepartmentGrid() {
  return (
    <div className="grid grid-cols-6 gap-3">
      {departments.map((dept) => (
        <DeptCard key={dept.name} dept={dept} />
      ))}
    </div>
  );
}
