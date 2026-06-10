import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const metadata: Metadata = {
  title: "Knowledge Base — AIWOS",
};

export default function KnowledgePage() {
  return (
    <PagePlaceholder
      title="Knowledge Base"
      description="Upload and manage documents, data, and knowledge for your agents."
    />
  );
}
