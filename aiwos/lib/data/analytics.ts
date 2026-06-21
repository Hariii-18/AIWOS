export interface TimeRange {
  label: string;
  value: "7d" | "30d" | "90d" | "1y";
}

export const timeRanges: TimeRange[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "1 year", value: "1y" },
];
