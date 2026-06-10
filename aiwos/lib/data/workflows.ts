export type WorkflowStatus = "Active" | "Inactive" | "Paused";

export interface Agent {
  id: string;
  name: string;
  initials: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  triggerEvent: string;
  assignedAgents: Agent[];
  status: WorkflowStatus;
  lastExecution: string;
  executionCount: number;
  successRate: number;
}

export const workflowsData: Workflow[] = [
  {
    id: "w1",
    name: "Customer Onboarding",
    description: "Automated workflow for new customer setup",
    triggerEvent: "New customer signup",
    assignedAgents: [
      { id: "a1", name: "Code Assistant", initials: "CA" },
      { id: "a6", name: "HR Manager", initials: "HM" },
    ],
    status: "Active",
    lastExecution: "2026-06-10T14:30:00",
    executionCount: 247,
    successRate: 98,
  },
  {
    id: "w2",
    name: "Report Generation",
    description: "Daily automated report creation and distribution",
    triggerEvent: "Daily at 6:00 AM",
    assignedAgents: [
      { id: "a4", name: "Data Analyst", initials: "DA" },
      { id: "a9", name: "Content Creator", initials: "CC" },
    ],
    status: "Active",
    lastExecution: "2026-06-10T06:00:00",
    executionCount: 156,
    successRate: 100,
  },
  {
    id: "w3",
    name: "Data Backup",
    description: "Hourly data backup and verification",
    triggerEvent: "Every hour",
    assignedAgents: [
      { id: "a8", name: "DevOps Engineer", initials: "DE" },
      { id: "a10", name: "Security Auditor", initials: "SA" },
    ],
    status: "Active",
    lastExecution: "2026-06-10T15:00:00",
    executionCount: 892,
    successRate: 99.8,
  },
  {
    id: "w4",
    name: "Payment Processing",
    description: "Process pending payments and send confirmations",
    triggerEvent: "Transaction received",
    assignedAgents: [
      { id: "a5", name: "Finance Agent", initials: "FA" },
      { id: "a1", name: "Code Assistant", initials: "CA" },
    ],
    status: "Active",
    lastExecution: "2026-06-10T15:45:00",
    executionCount: 1203,
    successRate: 97,
  },
  {
    id: "w5",
    name: "Email Marketing Campaign",
    description: "Send weekly marketing emails to subscribers",
    triggerEvent: "Every Monday at 9:00 AM",
    assignedAgents: [
      { id: "a7", name: "Marketing Strategist", initials: "MS" },
      { id: "a9", name: "Content Creator", initials: "CC" },
    ],
    status: "Active",
    lastExecution: "2026-06-09T09:00:00",
    executionCount: 78,
    successRate: 95,
  },
  {
    id: "w6",
    name: "Security Scan",
    description: "Automated security vulnerability scanning",
    triggerEvent: "Every 6 hours",
    assignedAgents: [
      { id: "a10", name: "Security Auditor", initials: "SA" },
      { id: "a8", name: "DevOps Engineer", initials: "DE" },
    ],
    status: "Active",
    lastExecution: "2026-06-10T12:00:00",
    executionCount: 340,
    successRate: 100,
  },
  {
    id: "w7",
    name: "Inventory Sync",
    description: "Synchronize inventory across all warehouses",
    triggerEvent: "Every 30 minutes",
    assignedAgents: [
      { id: "a4", name: "Data Analyst", initials: "DA" },
      { id: "a1", name: "Code Assistant", initials: "CA" },
    ],
    status: "Inactive",
    lastExecution: "2026-06-08T10:30:00",
    executionCount: 562,
    successRate: 94,
  },
  {
    id: "w8",
    name: "User Activity Analysis",
    description: "Analyze and log user behavior patterns",
    triggerEvent: "Real-time",
    assignedAgents: [
      { id: "a4", name: "Data Analyst", initials: "DA" },
      { id: "a14", name: "SEO Specialist", initials: "SS" },
    ],
    status: "Active",
    lastExecution: "2026-06-10T15:55:00",
    executionCount: 2145,
    successRate: 96,
  },
  {
    id: "w9",
    name: "Database Optimization",
    description: "Weekly database cleanup and optimization",
    triggerEvent: "Every Sunday at 2:00 AM",
    assignedAgents: [
      { id: "a8", name: "DevOps Engineer", initials: "DE" },
      { id: "a4", name: "Data Analyst", initials: "DA" },
    ],
    status: "Paused",
    lastExecution: "2026-06-01T02:00:00",
    executionCount: 12,
    successRate: 100,
  },
  {
    id: "w10",
    name: "Social Media Posting",
    description: "Scheduled social media content distribution",
    triggerEvent: "Scheduled posts queue",
    assignedAgents: [
      { id: "a9", name: "Content Creator", initials: "CC" },
      { id: "a7", name: "Marketing Strategist", initials: "MS" },
    ],
    status: "Active",
    lastExecution: "2026-06-10T14:00:00",
    executionCount: 423,
    successRate: 98,
  },
  {
    id: "w11",
    name: "Customer Feedback Processing",
    description: "Collect and analyze customer feedback",
    triggerEvent: "Feedback submission",
    assignedAgents: [
      { id: "a2", name: "UX Designer", initials: "UD" },
      { id: "a9", name: "Content Creator", initials: "CC" },
    ],
    status: "Active",
    lastExecution: "2026-06-10T13:20:00",
    executionCount: 634,
    successRate: 99,
  },
  {
    id: "w12",
    name: "API Rate Limit Monitoring",
    description: "Monitor and alert on API rate limit usage",
    triggerEvent: "Every 15 minutes",
    assignedAgents: [
      { id: "a8", name: "DevOps Engineer", initials: "DE" },
      { id: "a1", name: "Code Assistant", initials: "CA" },
    ],
    status: "Active",
    lastExecution: "2026-06-10T15:45:00",
    executionCount: 4821,
    successRate: 99.9,
  },
  {
    id: "w13",
    name: "License Renewal Reminder",
    description: "Send reminders for expiring licenses",
    triggerEvent: "Monthly",
    assignedAgents: [
      { id: "a6", name: "HR Manager", initials: "HM" },
      { id: "a9", name: "Content Creator", initials: "CC" },
    ],
    status: "Active",
    lastExecution: "2026-06-05T00:00:00",
    executionCount: 24,
    successRate: 100,
  },
  {
    id: "w14",
    name: "Performance Dashboard Update",
    description: "Update and refresh performance metrics",
    triggerEvent: "Every 5 minutes",
    assignedAgents: [
      { id: "a4", name: "Data Analyst", initials: "DA" },
      { id: "a14", name: "SEO Specialist", initials: "SS" },
    ],
    status: "Inactive",
    lastExecution: "2026-06-09T14:20:00",
    executionCount: 287,
    successRate: 92,
  },
  {
    id: "w15",
    name: "Certificate Renewal",
    description: "Automatic SSL certificate renewal and deployment",
    triggerEvent: "Certificate expires in 30 days",
    assignedAgents: [
      { id: "a8", name: "DevOps Engineer", initials: "DE" },
      { id: "a10", name: "Security Auditor", initials: "SA" },
    ],
    status: "Active",
    lastExecution: "2026-06-02T10:15:00",
    executionCount: 8,
    successRate: 100,
  },
];

export const workflowStatuses: WorkflowStatus[] = ["Active", "Inactive", "Paused"];
