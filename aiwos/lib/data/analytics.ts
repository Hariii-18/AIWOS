export interface AnalyticsKPI {
  totalTasks: number;
  completedTasks: number;
  successRate: number;
  avgResponseTime: number;
}

export interface CompletionTrendData {
  date: string;
  completed: number;
  total: number;
}

export interface DepartmentTaskData {
  department: string;
  tasks: number;
  color: string;
}

export interface TimeRange {
  label: string;
  value: "7d" | "30d" | "90d" | "1y";
}

export const analyticsKPI: AnalyticsKPI = {
  totalTasks: 342,
  completedTasks: 287,
  successRate: 84,
  avgResponseTime: 2.3,
};

export const taskCompletionTrend: Record<string, CompletionTrendData[]> = {
  "7d": [
    { date: "Jun 4", completed: 28, total: 35 },
    { date: "Jun 5", completed: 32, total: 40 },
    { date: "Jun 6", completed: 38, total: 42 },
    { date: "Jun 7", completed: 35, total: 45 },
    { date: "Jun 8", completed: 42, total: 48 },
    { date: "Jun 9", completed: 40, total: 50 },
    { date: "Jun 10", completed: 45, total: 52 },
  ],
  "30d": [
    { date: "May 11", completed: 25, total: 30 },
    { date: "May 18", completed: 42, total: 50 },
    { date: "May 25", completed: 55, total: 65 },
    { date: "Jun 1", completed: 48, total: 60 },
    { date: "Jun 8", completed: 62, total: 75 },
    { date: "Jun 10", completed: 45, total: 52 },
  ],
  "90d": [
    { date: "Mar", completed: 120, total: 150 },
    { date: "Apr", completed: 145, total: 175 },
    { date: "May", completed: 168, total: 200 },
    { date: "Jun", completed: 147, total: 175 },
  ],
  "1y": [
    { date: "Jun 2025", completed: 125, total: 155 },
    { date: "Jul 2025", completed: 142, total: 170 },
    { date: "Aug 2025", completed: 138, total: 165 },
    { date: "Sep 2025", completed: 155, total: 185 },
    { date: "Oct 2025", completed: 168, total: 200 },
    { date: "Nov 2025", completed: 175, total: 210 },
    { date: "Dec 2025", completed: 182, total: 218 },
    { date: "Jan 2026", completed: 195, total: 235 },
    { date: "Feb 2026", completed: 188, total: 224 },
    { date: "Mar 2026", completed: 202, total: 242 },
    { date: "Apr 2026", completed: 215, total: 258 },
    { date: "May 2026", completed: 208, total: 252 },
  ],
};

export const tasksByDepartment: DepartmentTaskData[] = [
  { department: "Engineering", tasks: 85, color: "#06b6d4" },
  { department: "Product", tasks: 62, color: "#10b981" },
  { department: "Design", tasks: 48, color: "#f59e0b" },
  { department: "Marketing", tasks: 52, color: "#ef4444" },
  { department: "Sales", tasks: 38, color: "#8b5cf6" },
  { department: "Support", tasks: 22, color: "#ec4899" },
];

export const timeRanges: TimeRange[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "1 year", value: "1y" },
];
