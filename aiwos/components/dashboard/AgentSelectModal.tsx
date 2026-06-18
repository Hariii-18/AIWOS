"use client";

import { useMemo, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import type { AgentApiResponse } from "@/lib/api/agents";

const GRADIENTS = [
  "linear-gradient(135deg, #7c3aed, #4f46e5)",
  "linear-gradient(135deg, #06b6d4, #0891b2)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #ec4899, #db2777)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #8b5cf6, #6d28d9)",
];

function avatarGradient(id: string): string {
  const n = parseInt(id.replace(/-/g, "").slice(-4), 16);
  return GRADIENTS[n % GRADIENTS.length];
}

function agentInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

interface AgentSelectModalProps {
  agents: AgentApiResponse[];
  prompt: string;
  isSubmitting: boolean;
  onSelect: (agent: AgentApiResponse) => void;
  onClose: () => void;
}

export function AgentSelectModal({
  agents,
  prompt,
  isSubmitting,
  onSelect,
  onClose,
}: AgentSelectModalProps) {
  const [search, setSearch] = useState("");

  const activeAgents = useMemo(
    () => agents.filter((a) => a.status === "Active" || a.status === "Created"),
    [agents],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return activeAgents;
    return activeAgents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.goal.toLowerCase().includes(q),
    );
  }, [activeAgents, search]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <div
        className="relative flex w-full max-w-lg flex-col rounded-2xl border shadow-2xl"
        style={{
          background: "var(--card)",
          borderColor: "var(--border-light)",
          maxHeight: "80vh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border-light)" }}
        >
          <div>
            <h2 className="text-sm font-semibold text-foreground">Select an Agent</h2>
            {prompt && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                &ldquo;{prompt.slice(0, 60)}{prompt.length > 60 ? "…" : ""}&rdquo;
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[var(--accent)] hover:text-foreground disabled:opacity-40"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative flex items-center">
            <Search
              size={13}
              className="pointer-events-none absolute left-2.5"
              style={{ color: "var(--faint)" }}
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents…"
              autoFocus
              className="h-9 w-full rounded-lg border pl-8 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/25"
              style={{
                background: "var(--input-bg)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>

        {/* Agent list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {activeAgents.length === 0
                ? "No agents found. Create one from the Agents page first."
                : "No agents match your search."}
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map((agent) => {
                const color = avatarGradient(agent.id);
                const initials = agentInitials(agent.name);
                const isActive = agent.status === "Active";

                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => onSelect(agent)}
                    disabled={isSubmitting}
                    className="flex items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all hover:-translate-y-px hover:shadow-sm disabled:opacity-50"
                    style={{
                      borderColor: "var(--border-light)",
                      background: "var(--surface)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--purple)";
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-glow)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-light)";
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--surface)";
                    }}
                  >
                    {/* Avatar */}
                    <div className="relative mt-0.5 shrink-0">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{ background: color }}
                      >
                        {initials}
                      </div>
                      <span
                        className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2"
                        style={{
                          background: isActive ? "var(--green)" : "var(--faint)",
                          borderColor: "var(--surface)",
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {agent.name}
                        </span>
                        <span
                          className="shrink-0 rounded-full px-2 py-px text-[10px] font-medium"
                          style={{
                            background: isActive ? "rgba(16,185,129,0.12)" : "rgba(100,116,139,0.12)",
                            color: isActive ? "var(--green)" : "var(--faint)",
                          }}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">{agent.role}</p>
                      {agent.goal && (
                        <p className="mt-1 truncate text-[11px]" style={{ color: "var(--faint)" }}>
                          {agent.goal.slice(0, 80)}
                        </p>
                      )}
                      {agent.skills.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {agent.skills.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="rounded-full px-1.5 py-px text-[10px]"
                              style={{ background: "var(--accent-glow)", color: "var(--purple)" }}
                            >
                              {s}
                            </span>
                          ))}
                          {agent.skills.length > 4 && (
                            <span className="text-[10px]" style={{ color: "var(--faint)" }}>
                              +{agent.skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {isSubmitting && (
                      <Loader2 size={14} className="mt-1 shrink-0 animate-spin" style={{ color: "var(--purple)" }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
