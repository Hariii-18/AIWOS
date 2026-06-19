"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/store/auth";
import { analyticsApi } from "@/lib/api/analytics";
import type { StatCard } from "@/lib/types";

import { StatCard as StatCardComponent, StatCardSkeleton } from "./StatCard";
import { DepartmentGrid } from "./DepartmentGrid";
import { TaskCompletionChart } from "./TaskCompletionChart";
import { TopAgents } from "./TopAgents";
import { RecentActivities } from "./RecentActivities";

function buildStatCards(stats: {
  total_agents: number;
  running_tasks: number;
  tasks_completed: number;
  total_projects: number;
  active_projects: number;
  total_executions: number;
  workflow_count: number;
  total_cost_today: number;
}): StatCard[] {
  return [
    {
      label: "Total Agents",
      value: String(stats.total_agents),
      delta:
        stats.total_executions > 0
          ? `${stats.total_executions} executions run`
          : undefined,
      deltaType: "up",
      icon: "Bot",
      color: "var(--purple)",
      bgColor: "rgba(124,58,237,0.12)",
    },
    {
      label: "Running Tasks",
      value: String(stats.running_tasks),
      delta:
        stats.tasks_completed > 0
          ? `${stats.tasks_completed} completed total`
          : undefined,
      deltaType: "up",
      icon: "Play",
      color: "var(--cyan)",
      bgColor: "rgba(6,182,212,0.12)",
    },
    {
      label: "Tasks Completed",
      value: String(stats.tasks_completed),
      delta:
        stats.active_projects > 0
          ? `${stats.active_projects} active projects`
          : undefined,
      deltaType: "up",
      icon: "CheckCircle",
      color: "var(--green)",
      bgColor: "rgba(16,185,129,0.12)",
    },
    {
      label: "Total Cost (Today)",
      value: `$${stats.total_cost_today.toFixed(4)}`,
      delta:
        stats.workflow_count > 0
          ? `${stats.workflow_count} workflows`
          : undefined,
      deltaType: "up",
      icon: "DollarSign",
      color: "var(--amber)",
      bgColor: "rgba(245,158,11,0.12)",
    },
  ];
}

export function DashboardContent() {
  const { currentOrgId, user } = useAuthStore();
  const isAuthenticated = !user?.isGuest && !!currentOrgId;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", currentOrgId],
    queryFn: () => analyticsApi.dashboard(currentOrgId!),
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border py-16 text-center"
        style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
      >
        <p className="text-sm font-medium text-foreground">
          Sign in to see your live dashboard
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Real-time metrics, agent activity and task progress will appear here.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border py-16 text-center"
        style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
      >
        <p className="text-sm font-medium text-foreground">
          Failed to load dashboard data
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Check your connection or refresh the page.
        </p>
      </div>
    );
  }

  const statCards = data ? buildStatCards(data.stats) : [];

  return (
    <>
      {/* Stat Cards */}
      <div className="mb-6 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((card) => (
              <StatCardComponent key={card.label} card={card} />
            ))}
      </div>

      {/* Department Overview */}
      <div className="mb-6">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-foreground">
            Department Overview
          </span>
          <Link
            href="/agents"
            className="flex items-center gap-1 text-xs transition-colors hover:underline"
            style={{ color: "var(--purple)" }}
          >
            View All <ChevronRight size={12} />
          </Link>
        </div>
        <DepartmentGrid
          departments={data?.departments}
          isLoading={isLoading}
        />
      </div>

      {/* Bottom two-column layout */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-4">
          <TaskCompletionChart
            weeklyData={data?.weekly_completions}
            isLoading={isLoading}
          />
          <TopAgents agents={data?.top_agents} isLoading={isLoading} />
        </div>
        <RecentActivities
          activities={data?.recent_activities}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
