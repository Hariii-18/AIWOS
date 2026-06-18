"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentApiResponse } from "@/lib/api/agents";
import type { ConversationResponse } from "@/lib/api/conversations";

export type { AgentApiResponse };

const GRADIENTS = [
  "linear-gradient(135deg, #7c3aed, #4f46e5)",
  "linear-gradient(135deg, #06b6d4, #0891b2)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #ec4899, #db2777)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #8b5cf6, #6d28d9)",
];

export function avatarGradient(id: string): string {
  const n = parseInt(id.replace(/-/g, "").slice(-4), 16);
  return GRADIENTS[n % GRADIENTS.length];
}

export function agentInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "Active"
      ? "var(--green)"
      : status === "Paused"
        ? "var(--amber)"
        : "var(--faint)";

  return (
    <span
      className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2"
      style={{ background: color, borderColor: "var(--card)" }}
      aria-label={status}
    />
  );
}

interface AgentSidebarProps {
  agents: AgentApiResponse[];
  conversations: ConversationResponse[];
  selectedAgentId: string | null;
  isCreating: boolean;
  onSelect: (agentId: string) => void;
}

export function ConversationSidebar({
  agents,
  conversations,
  selectedAgentId,
  isCreating,
  onSelect,
}: AgentSidebarProps) {
  const [search, setSearch] = useState("");

  // Map agent_id → most recent conversation for last-message preview
  const latestConvByAgent = useMemo(() => {
    const map = new Map<string, ConversationResponse>();
    for (const conv of conversations) {
      if (!conv.agent_id) continue;
      const existing = map.get(conv.agent_id);
      if (!existing || conv.updated_at > existing.updated_at) {
        map.set(conv.agent_id, conv);
      }
    }
    return map;
  }, [conversations]);

  // Active agents first, then sort by whether they have a conversation
  const sorted = useMemo(() => {
    return [...agents].sort((a, b) => {
      const aHasConv = latestConvByAgent.has(a.id) ? 0 : 1;
      const bHasConv = latestConvByAgent.has(b.id) ? 0 : 1;
      if (aHasConv !== bHasConv) return aHasConv - bHasConv;
      const aActive = a.status === "Active" ? 0 : 1;
      const bActive = b.status === "Active" ? 0 : 1;
      return aActive - bActive;
    });
  }, [agents, latestConvByAgent]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q),
    );
  }, [sorted, search]);

  // Separate into agents with and without conversations
  const withConvs = filtered.filter((a) => latestConvByAgent.has(a.id));
  const withoutConvs = filtered.filter((a) => !latestConvByAgent.has(a.id));

  function renderAgent(agent: AgentApiResponse) {
    const conv = latestConvByAgent.get(agent.id);
    const lastMsg = conv?.messages[conv.messages.length - 1];
    const isActive = agent.id === selectedAgentId;
    const initials = agentInitials(agent.name);
    const color = avatarGradient(agent.id);

    return (
      <button
        key={agent.id}
        type="button"
        onClick={() => onSelect(agent.id)}
        disabled={isCreating && !isActive}
        className={cn(
          "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/25",
          isActive
            ? "border-l-[3px]"
            : "border-l-[3px] border-l-transparent hover:bg-[var(--accent)] disabled:opacity-60",
        )}
        style={
          isActive
            ? { background: "var(--accent-glow)", borderLeftColor: "var(--purple)" }
            : {}
        }
        aria-current={isActive ? "true" : undefined}
      >
        {/* Avatar */}
        <div className="relative mt-0.5 shrink-0">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{ background: color }}
          >
            {initials}
          </div>
          <StatusDot status={agent.status} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "truncate text-[13px]",
                isActive ? "font-semibold text-foreground" : "font-medium text-foreground",
              )}
            >
              {agent.name}
            </span>
            {lastMsg && (
              <span className="shrink-0 text-[10px]" style={{ color: "var(--faint)" }}>
                {new Date(lastMsg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[12px]" style={{ color: "var(--faint)" }}>
              {lastMsg
                ? lastMsg.content.slice(0, 60)
                : agent.role}
            </span>
            {isActive && isCreating && (
              <span
                className="shrink-0 rounded-full px-1.5 py-px text-[10px] font-semibold text-white"
                style={{ background: "var(--purple)" }}
              >
                …
              </span>
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{ borderRight: "1px solid var(--border-light)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border-light)" }}
      >
        <span className="text-sm font-semibold text-foreground">Agents</span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
          style={{ background: "var(--purple)" }}
        >
          {agents.length}
        </span>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5">
        <div className="relative flex items-center">
          <Search
            size={13}
            className="pointer-events-none absolute left-2.5"
            style={{ color: "var(--faint)" }}
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search agents"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents..."
            className="h-8 w-full rounded-lg border pl-8 pr-3 text-[13px] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25"
            style={{
              background: "var(--input-bg)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">
            {agents.length === 0
              ? "No agents yet. Create one from the Agents page."
              : "No agents match your search."}
          </p>
        )}

        {/* Agents with existing conversations */}
        {withConvs.length > 0 && (
          <>
            <p
              className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--faint)" }}
            >
              Recent
            </p>
            {withConvs.map(renderAgent)}
          </>
        )}

        {/* Agents without conversations */}
        {withoutConvs.length > 0 && (
          <>
            <p
              className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--faint)" }}
            >
              {withConvs.length > 0 ? "All Agents" : "Agents"}
            </p>
            {withoutConvs.map(renderAgent)}
          </>
        )}

        {/* Empty-state prompt */}
        {agents.length > 0 && !selectedAgentId && (
          <div className="mx-3 mt-4 flex flex-col items-center gap-2 rounded-lg border border-dashed px-3 py-4 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <MessageCircle size={18} style={{ color: "var(--faint)" }} />
            <p className="text-[11px] text-muted-foreground">
              Select an agent to start a conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
