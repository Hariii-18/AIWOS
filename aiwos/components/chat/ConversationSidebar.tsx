"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentStatus, Conversation } from "@/lib/data/chat";

interface ConversationSidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function StatusDot({ status }: { status: AgentStatus }) {
  const color =
    status === "online"
      ? "var(--green)"
      : status === "busy"
        ? "var(--amber)"
        : "var(--faint)";

  return (
    <span
      className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2"
      style={{
        background: color,
        borderColor: "var(--card)",
      }}
      aria-label={status}
    />
  );
}

export function ConversationSidebar({
  conversations,
  selectedId,
  onSelect,
}: ConversationSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.agentName.toLowerCase().includes(q) ||
        c.agentRole.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [conversations, search]);

  return (
    <div
      className="flex h-full flex-col"
      style={{ borderRight: "1px solid var(--border-light)" }}
    >
      {/* Sidebar header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border-light)" }}
      >
        <span className="text-sm font-semibold text-foreground">Agents</span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
          style={{ background: "var(--purple)" }}
        >
          {conversations.length}
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
            aria-label="Search conversations"
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

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">
            No agents found
          </p>
        ) : (
          filtered.map((conv) => {
            const isActive = conv.id === selectedId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "flex w-full items-start gap-3 px-3 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/25",
                  isActive
                    ? "border-l-[3px]"
                    : "border-l-[3px] border-l-transparent hover:bg-[var(--accent)]",
                )}
                style={
                  isActive
                    ? {
                        background: "var(--accent-glow)",
                        borderLeftColor: "var(--purple)",
                      }
                    : {}
                }
                aria-current={isActive ? "true" : undefined}
              >
                {/* Avatar */}
                <div className="relative mt-0.5 shrink-0">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                    style={{ background: conv.agentColor }}
                  >
                    {conv.agentInitials}
                  </div>
                  <StatusDot status={conv.status} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-[13px]",
                        isActive
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground",
                      )}
                    >
                      {conv.agentName}
                    </span>
                    <span
                      className="shrink-0 text-[10px]"
                      style={{ color: "var(--faint)" }}
                    >
                      {conv.lastMessageAt}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="truncate text-[12px]"
                      style={{ color: "var(--faint)" }}
                    >
                      {conv.lastMessage}
                    </span>
                    {conv.unread > 0 && (
                      <span
                        className="shrink-0 rounded-full px-1.5 py-px text-[10px] font-semibold text-white"
                        style={{ background: "var(--purple)" }}
                      >
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
