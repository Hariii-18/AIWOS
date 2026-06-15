"use client";

import { useState } from "react";
import {
  analyticsKPI,
  taskCompletionTrend,
  tasksByDepartment,
} from "@/lib/data/analytics";
import { AnalyticsKPICard } from "@/components/analytics/AnalyticsKPICard";
import { TimeRangeSelector } from "@/components/analytics/TimeRangeSelector";
import { TaskCompletionTrendChart } from "@/components/analytics/TaskCompletionTrendChart";
import { TasksByDepartmentChart } from "@/components/analytics/TasksByDepartmentChart";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("7d");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Performance metrics and insights
          </p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <AnalyticsKPICard
          title="Total Tasks"
          value={analyticsKPI.totalTasks}
          trend="up"
          trendValue={12}
        />
        <AnalyticsKPICard
          title="Completed Tasks"
          value={analyticsKPI.completedTasks}
          trend="up"
          trendValue={8}
        />
        <AnalyticsKPICard
          title="Success Rate"
          value={analyticsKPI.successRate}
          unit="%"
          trend="up"
          trendValue={5}
        />
        <AnalyticsKPICard
          title="Avg Response Time"
          value={analyticsKPI.avgResponseTime}
          unit="hrs"
          trend="down"
          trendValue={2}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TaskCompletionTrendChart data={taskCompletionTrend[timeRange]} />
        </div>
        <TasksByDepartmentChart data={tasksByDepartment} />
      </div>
    </div>
  );
}
