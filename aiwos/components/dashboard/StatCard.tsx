import {
  Bot,
  Play,
  CheckCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCard as StatCardType } from "@/lib/types";

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  Bot,
  Play,
  CheckCircle,
  DollarSign,
};

interface Props {
  card: StatCardType;
  isLoading?: boolean;
}

export function StatCardSkeleton() {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <div className="h-3.5 w-3.5 animate-pulse rounded bg-[var(--border)]" />
        <div className="h-3 w-24 animate-pulse rounded bg-[var(--border)]" />
      </div>
      <div className="flex items-start justify-between">
        <div className="h-8 w-20 animate-pulse rounded bg-[var(--border)]" />
        <div className="h-9 w-9 animate-pulse rounded-lg bg-[var(--border)]" />
      </div>
      <div className="mt-1.5 h-3 w-32 animate-pulse rounded bg-[var(--border)]" />
    </div>
  );
}

export function StatCard({ card, isLoading }: Props) {
  if (isLoading) return <StatCardSkeleton />;

  const Icon = ICONS[card.icon] ?? Bot;

  return (
    <div
      className="cursor-default rounded-xl border p-4 transition-colors hover:border-border"
      style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
    >
      <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon size={14} style={{ color: card.color }} />
        {card.label}
      </div>
      <div className="flex items-start justify-between">
        <div className="text-[26px] font-bold leading-tight text-foreground">
          {card.value}
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: card.bgColor, color: card.color }}
        >
          <Icon size={18} />
        </div>
      </div>
      {card.delta && (
        <div
          className={cn(
            "mt-1.5 flex items-center gap-1 text-[11px]",
            card.deltaType === "up"
              ? "text-[var(--green)]"
              : "text-[var(--red)]",
          )}
        >
          {card.deltaType === "up" ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {card.delta}
        </div>
      )}
    </div>
  );
}
