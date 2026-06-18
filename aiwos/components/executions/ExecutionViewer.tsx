"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, Loader2, AlertCircle, Clock, Zap } from "lucide-react";
import { executionApi, type ExecutionApiResponse } from "@/lib/api/executions";

interface ExecutionViewerProps {
  executionId: string;
  taskTitle: string;
  onClose: () => void;
}

function formatMs(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function ExecutionViewer({ executionId, taskTitle, onClose }: ExecutionViewerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const { data: execution, isPending, error } = useQuery<ExecutionApiResponse>({
    queryKey: ["execution", executionId],
    queryFn: () => executionApi.get(executionId),
    staleTime: 30_000,
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const content = execution?.output_data?.content ?? null;
  const statusColor =
    execution?.status === "completed"
      ? "var(--green)"
      : execution?.status === "failed"
        ? "var(--red)"
        : "var(--amber)";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        style={{ background: "var(--card)", borderColor: "var(--border-light)" }}
      >
        {/* Header */}
        <div
          className="flex shrink-0 items-start justify-between gap-4 border-b px-6 py-4"
          style={{ borderColor: "var(--border-light)", background: "var(--surface)" }}
        >
          <div className="min-w-0">
            <p className="mb-0.5 text-xs font-medium text-muted-foreground">Deliverable</p>
            <h2 className="truncate text-base font-semibold text-foreground">{taskTitle}</h2>
            {execution && (
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium"
                  style={{
                    background: `color-mix(in srgb, ${statusColor} 12%, transparent)`,
                    color: statusColor,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor }} />
                  {execution.status}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {formatMs(execution.execution_time_ms)}
                </span>
                {execution.token_count > 0 && (
                  <span className="flex items-center gap-1">
                    <Zap size={11} />
                    {execution.token_count.toLocaleString()} tokens
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-[var(--border)] hover:text-foreground"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isPending && (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 size={20} className="mr-2 animate-spin" />
              Loading deliverable…
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              Failed to load execution output.
            </div>
          )}

          {execution?.status === "failed" && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                <span className="font-semibold">Execution failed:</span>{" "}
                {execution.error_message ?? "Unknown error"}
              </span>
            </div>
          )}

          {content && (
            <div className="aiwos-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          )}

          {!isPending && !error && !content && execution?.status !== "failed" && (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No output available for this execution.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
