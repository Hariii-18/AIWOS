import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const metadata: Metadata = {
  title: "Integrations — AIWOS",
};

export default function IntegrationsPage() {
  return (
    <PagePlaceholder
      title="Integrations"
      description="Connect external tools and services to enhance your AI workforce."
    />
  );
}
