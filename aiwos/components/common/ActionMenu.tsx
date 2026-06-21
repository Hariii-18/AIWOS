"use client";

import {
  Eye,
  Pencil,
  Copy,
  Archive,
  Play,
  Pause,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ActionMenuProps {
  label?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export function ActionMenu({
  label = "Actions",
  onView,
  onEdit,
  onDuplicate,
  onActivate,
  onDeactivate,
  onArchive,
  onDelete,
}: ActionMenuProps) {
  const hasStatusActions = onActivate || onDeactivate || onArchive;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-[var(--border)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple)]"
          aria-label={label}
        >
          <MoreVertical size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye />
            View
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil />
            Edit
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy />
            Duplicate
          </DropdownMenuItem>
        )}
        {hasStatusActions && <DropdownMenuSeparator />}
        {onActivate && (
          <DropdownMenuItem onClick={onActivate}>
            <Play />
            Activate
          </DropdownMenuItem>
        )}
        {onDeactivate && (
          <DropdownMenuItem onClick={onDeactivate}>
            <Pause />
            Deactivate
          </DropdownMenuItem>
        )}
        {onArchive && (
          <DropdownMenuItem onClick={onArchive}>
            <Archive />
            Archive
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
