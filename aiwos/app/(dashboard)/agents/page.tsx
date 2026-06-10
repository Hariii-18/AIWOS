import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const metadata: Metadata = {
  title: "Agents — AIWOS",
};

export default function AgentsPage() {
  return (
    <PagePlaceholder
      title="Agents"
      description="Manage and monitor your AI agents, their status, performance, and assignments."
    />
  );
}
