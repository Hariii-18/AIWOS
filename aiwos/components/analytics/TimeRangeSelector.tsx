"use client";

import { timeRanges } from "@/lib/data/analytics";

interface TimeRangeSelectorProps {
  value: "7d" | "30d" | "90d" | "1y";
  onChange: (value: "7d" | "30d" | "90d" | "1y") => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-2">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: value === range.value ? "var(--purple)" : "var(--input-bg)",
            color: value === range.value ? "white" : "var(--muted-foreground)",
            borderColor: "var(--border)",
            border: value === range.value ? "none" : "1px solid var(--border)",
          }}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
