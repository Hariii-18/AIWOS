"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { workflowsData } from "@/lib/data/workflows";
import { WorkflowSearchBar } from "@/components/workflows/WorkflowSearchBar";
import { WorkflowFilterBar } from "@/components/workflows/WorkflowFilterBar";
import { WorkflowTable } from "@/components/workflows/WorkflowTable";

export default function WorkflowsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredWorkflows = useMemo(() => {
    return workflowsData.filter((workflow) => {
      const matchesSearch =
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.triggerEvent
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter ? workflow.status === statusFilter : true;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalWorkflows = workflowsData.length;
  const activeWorkflows = workflowsData.filter(
    (w) => w.status === "Active"
  ).length;
  const avgSuccessRate =
    Math.round(
      workflowsData.reduce((sum, w) => sum + w.successRate, 0) /
        workflowsData.length
    ) || 0;
  const totalExecutions = workflowsData.reduce(
    (sum, w) => sum + w.executionCount,
    0
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workflows</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor automated workflows
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all"
          style={{
            background: "var(--purple)",
            color: "white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#6d28d9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--purple)";
          }}
        >
          <Plus size={16} />
          Create Workflow
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div
          className="rounded-lg border p-4"
          style={{
            background: "var(--card)",
            borderColor: "var(--border-light)",
          }}
        >
          <p className="text-xs text-muted-foreground">Total Workflows</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {totalWorkflows}
          </p>
        </div>
        <div
          className="rounded-lg border p-4"
          style={{
            background: "var(--card)",
            borderColor: "var(--border-light)",
          }}
        >
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="mt-2 text-2xl font-bold text-cyan">
            {activeWorkflows}
          </p>
        </div>
        <div
          className="rounded-lg border p-4"
          style={{
            background: "var(--card)",
            borderColor: "var(--border-light)",
          }}
        >
          <p className="text-xs text-muted-foreground">Avg Success Rate</p>
          <p className="mt-2 text-2xl font-bold text-green">
            {avgSuccessRate}%
          </p>
        </div>
        <div
          className="rounded-lg border p-4"
          style={{
            background: "var(--card)",
            borderColor: "var(--border-light)",
          }}
        >
          <p className="text-xs text-muted-foreground">Total Executions</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {totalExecutions.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-sm">
          <WorkflowSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search workflows..."
          />
        </div>
        <WorkflowFilterBar
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onReset={() => {
            setSearchQuery("");
            setStatusFilter("");
          }}
        />
      </div>

      {/* Table */}
      <WorkflowTable workflows={filteredWorkflows} />
    </div>
  );
}
