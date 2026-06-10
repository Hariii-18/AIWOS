import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const metadata: Metadata = {
  title: "Tasks — AIWOS",
};

export default function TasksPage() {
  return (
    <PagePlaceholder
      title="Tasks"
      description="View, create, and manage tasks assigned to your AI agents."
    />
  );
}
