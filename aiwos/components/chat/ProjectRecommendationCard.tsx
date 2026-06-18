"use client";

import { useState } from "react";
import { FolderPlus, CheckSquare, ChevronRight } from "lucide-react";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import type { ProjectRecommendationMetadata } from "@/lib/data/chat";

interface Props {
  metadata: ProjectRecommendationMetadata;
}

export function ProjectRecommendationCard({ metadata }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          borderColor: "var(--border-light)",
          background: "var(--surface)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-2.5"
          style={{ borderBottom: "1px solid var(--border-light)" }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--accent-glow)" }}
          >
            <FolderPlus size={14} style={{ color: "var(--purple)" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--purple)" }}>
              Project Recommendation
            </p>
            <p className="truncate text-sm font-semibold text-foreground leading-tight">
              {metadata.name}
            </p>
          </div>
        </div>

        {/* Description */}
        {metadata.description && (
          <p className="px-3.5 pt-2.5 pb-0 text-[12px] leading-relaxed text-muted-foreground">
            {metadata.description}
          </p>
        )}

        {/* Tasks */}
        {metadata.tasks.length > 0 && (
          <div className="px-3.5 py-2.5">
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--faint)" }}
            >
              Suggested Tasks
            </p>
            <ul className="flex flex-col gap-1.5">
              {metadata.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-foreground">
                  <CheckSquare
                    size={13}
                    className="mt-0.5 shrink-0"
                    style={{ color: "var(--purple)" }}
                  />
                  <span className="leading-relaxed">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-end px-3.5 py-2"
          style={{
            borderTop: "1px solid var(--border-light)",
            background: "var(--elevated)",
          }}
        >
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-white transition-opacity hover:opacity-90 active:opacity-80"
            style={{ background: "var(--purple)" }}
          >
            Create Project
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <CreateProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialName={metadata.name}
        initialDescription={metadata.description}
      />
    </>
  );
}
