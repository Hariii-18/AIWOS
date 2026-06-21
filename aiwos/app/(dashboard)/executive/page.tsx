"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { Bot, CheckSquare, FolderKanban, Zap, Loader2 } from "lucide-react";
import { projectApi, type ProjectApiResponse } from "@/lib/api/projects";
import { agentApi } from "@/lib/api/agents";
import { taskApi } from "@/lib/api/tasks";
import { executionApi } from "@/lib/api/executions";
import { useAuthStore } from "@/lib/store/auth";
import { projectsData, type Project } from "@/lib/data/projects";
import { agentsData } from "@/lib/data/agents";
import { tasksData } from "@/lib/data/tasks";

const MOCK_EXECUTIONS = 47;

function projectHealthBucket(status: string): "completed" | "inProgress" | "pending" {
  if (status === "Completed") return "completed";
  if (status === "Active") return "inProgress";
  return "pending";
}

function MetricCard({
  label,
  value,
  icon,
  color,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg opacity-90"
          style={{ background: "var(--accent-glow)", color }}
        >
          {icon}
        </div>
      </div>
      {loading ? (
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      ) : (
        <div className="text-3xl font-bold text-foreground">{value}</div>
      )}
    </div>
  );
}

function HealthBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">{count}</span>
          <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
            {pct}%
          </span>
        </div>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: "var(--border-light)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function ExecutivePage() {
  const { user, currentOrgId } = useAuthStore();
  const isGuest = user?.isGuest ?? true;

  const { data: apiProjects, isPending: projectsPending } = useQuery({
    queryKey: ["projects", currentOrgId],
    queryFn: () => projectApi.list(currentOrgId!),
    enabled: !isGuest && !!currentOrgId,
  });

  const { data: apiAgents, isPending: agentsPending } = useQuery({
    queryKey: ["agents", currentOrgId],
    queryFn: () => agentApi.list(currentOrgId!),
    enabled: !isGuest && !!currentOrgId,
  });

  const resolvedProjects: ProjectApiResponse[] = isGuest ? [] : (apiProjects ?? []);

  const taskQueries = useQueries({
    queries: resolvedProjects.map((p) => ({
      queryKey: ["tasks", p.id],
      queryFn: () => taskApi.list(p.id),
      enabled: !isGuest && !!p.id,
    })),
  });

  const { data: apiExecutions, isPending: executionsPending } = useQuery({
    queryKey: ["executions"],
    queryFn: () => executionApi.list(),
    enabled: !isGuest,
  });

  // Counts
  const totalProjects = isGuest ? projectsData.length : (apiProjects?.length ?? 0);
  const totalAgents = isGuest ? agentsData.length : (apiAgents?.length ?? 0);
  const totalTasks = isGuest
    ? tasksData.length
    : taskQueries.reduce((n, q) => n + (q.data?.length ?? 0), 0);
  const totalExecutions = isGuest ? MOCK_EXECUTIONS : (apiExecutions?.length ?? 0);

  // Project health buckets
  const health = (() => {
    const acc = { completed: 0, inProgress: 0, pending: 0 };
    if (isGuest) {
      for (const p of projectsData) {
        const bucket = projectHealthBucket(
          p.status === "On Hold" ? "OnHold" : p.status
        );
        acc[bucket]++;
      }
    } else {
      for (const p of apiProjects ?? []) {
        acc[projectHealthBucket(p.status)]++;
      }
    }
    return acc;
  })();

  const isLoadingBase = !isGuest && (projectsPending || agentsPending);
  const isLoadingTasks =
    !isGuest && (projectsPending || taskQueries.some((q) => q.isPending && !q.data));

  return (
    <div className="min-h-full">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold text-foreground">Executive Overview</h1>
        <p className="text-sm text-muted-foreground">
          CEO-level summary of organizational AI activity.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Projects"
          value={totalProjects}
          icon={<FolderKanban size={16} />}
          color="var(--purple)"
          loading={isLoadingBase && projectsPending}
        />
        <MetricCard
          label="Total Agents"
          value={totalAgents}
          icon={<Bot size={16} />}
          color="var(--cyan)"
          loading={isLoadingBase && agentsPending}
        />
        <MetricCard
          label="Total Tasks"
          value={totalTasks}
          icon={<CheckSquare size={16} />}
          color="var(--green)"
          loading={isLoadingTasks}
        />
        <MetricCard
          label="Total Executions"
          value={totalExecutions}
          icon={<Zap size={16} />}
          color="var(--amber)"
          loading={!isGuest && executionsPending}
        />
      </div>

      <div
        className="rounded-xl border p-6"
        style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Project Health</h2>
          <span className="text-xs text-muted-foreground">{totalProjects} total</span>
        </div>

        {totalProjects === 0 ? (
          <p className="text-sm text-muted-foreground">No projects to display.</p>
        ) : (
          <div className="flex flex-col gap-5">
            <HealthBar
              label="Completed"
              count={health.completed}
              total={totalProjects}
              color="var(--green)"
            />
            <HealthBar
              label="In Progress"
              count={health.inProgress}
              total={totalProjects}
              color="var(--cyan)"
            />
            <HealthBar
              label="Pending / On Hold"
              count={health.pending}
              total={totalProjects}
              color="var(--amber)"
            />
          </div>
        )}
      </div>
    </div>
  );
}
