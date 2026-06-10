import type { Workflow } from "@/lib/data/workflows";

interface WorkflowTableProps {
  workflows: Workflow[];
}

function StatusBadge({ status }: { status: "Active" | "Inactive" | "Paused" }) {
  let bgColor: string;
  let textColor: string;

  switch (status) {
    case "Active":
      bgColor = "rgba(16,185,129,0.12)";
      textColor = "var(--green)";
      break;
    case "Inactive":
      bgColor = "rgba(107,114,128,0.12)";
      textColor = "var(--muted-foreground)";
      break;
    case "Paused":
      bgColor = "rgba(245,158,11,0.12)";
      textColor = "var(--amber)";
      break;
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: bgColor,
        color: textColor,
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: textColor }}
      />
      {status}
    </span>
  );
}

export function WorkflowTable({ workflows }: WorkflowTableProps) {
  if (workflows.length === 0) {
    return (
      <div
        className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border"
        style={{
          background: "var(--card)",
          borderColor: "var(--border-light)",
        }}
      >
        <p className="text-sm text-muted-foreground">
          No workflows found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{
        background: "var(--card)",
        borderColor: "var(--border-light)",
      }}
    >
      <table className="w-full">
        <thead>
          <tr
            style={{
              background: "var(--input-bg)",
              borderBottomColor: "var(--border-light)",
            }}
            className="border-b"
          >
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
              Workflow Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
              Trigger Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
              Assigned Agents
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
              Last Executed
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
              Success Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((workflow) => (
            <tr
              key={workflow.id}
              style={{
                borderBottomColor: "var(--border-light)",
              }}
              className="border-b transition-colors hover:bg-opacity-50"
            >
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {workflow.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {workflow.description}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-muted-foreground">
                  {workflow.triggerEvent}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  {workflow.assignedAgents.slice(0, 2).map((agent) => (
                    <div
                      key={agent.id}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                      style={{
                        background:
                          agent.id === "a1"
                            ? "linear-gradient(135deg, #06b6d4, #10b981)"
                            : agent.id === "a2"
                              ? "linear-gradient(135deg, #ef4444, #ec4899)"
                              : agent.id === "a4"
                                ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                                : agent.id === "a5"
                                  ? "linear-gradient(135deg, #ef4444, #ec4899)"
                                  : agent.id === "a6"
                                    ? "linear-gradient(135deg, #ec4899, #7c3aed)"
                                    : agent.id === "a7"
                                      ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                                      : agent.id === "a8"
                                        ? "linear-gradient(135deg, #06b6d4, #10b981)"
                                        : agent.id === "a9"
                                          ? "linear-gradient(135deg, #10b981, #f59e0b)"
                                          : agent.id === "a10"
                                            ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                                            : agent.id === "a14"
                                              ? "linear-gradient(135deg, #06b6d4, #10b981)"
                                              : "linear-gradient(135deg, #7c3aed, #06b6d4)",
                      }}
                      title={agent.name}
                    >
                      {agent.initials}
                    </div>
                  ))}
                  {workflow.assignedAgents.length > 2 && (
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
                      style={{
                        background: "var(--border)",
                        color: "var(--text-secondary)",
                      }}
                      title={`+${workflow.assignedAgents.length - 2} more`}
                    >
                      +{workflow.assignedAgents.length - 2}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={workflow.status} />
              </td>
              <td className="px-6 py-4">
                <span className="text-xs text-muted-foreground">
                  {new Date(workflow.lastExecution).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-border rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${workflow.successRate}%`,
                        background:
                          workflow.successRate >= 99
                            ? "var(--green)"
                            : workflow.successRate >= 95
                              ? "var(--cyan)"
                              : "var(--amber)",
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-10">
                    {workflow.successRate}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
