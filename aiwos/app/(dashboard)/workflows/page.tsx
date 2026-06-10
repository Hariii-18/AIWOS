import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const metadata: Metadata = {
  title: "Workflows — AIWOS",
};

export default function WorkflowsPage() {
  return (
    <PagePlaceholder
      title="Workflows"
      description="Design and manage automated workflows that orchestrate your AI agents."
    />
  );
}
