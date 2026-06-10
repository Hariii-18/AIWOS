import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const metadata: Metadata = {
  title: "Analytics — AIWOS",
};

export default function AnalyticsPage() {
  return (
    <PagePlaceholder
      title="Analytics"
      description="View detailed analytics and insights about your AI workforce performance."
    />
  );
}
