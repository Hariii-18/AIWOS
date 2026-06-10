import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const metadata: Metadata = {
  title: "Settings — AIWOS",
};

export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Configure your workspace, user preferences, and system settings."
    />
  );
}
