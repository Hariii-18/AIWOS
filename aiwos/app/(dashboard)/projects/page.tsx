import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const metadata: Metadata = {
  title: "Projects — AIWOS",
};

export default function ProjectsPage() {
  return (
    <PagePlaceholder
      title="Projects"
      description="Organize and track your AI-powered projects and their progress."
    />
  );
}
