import type { Metadata } from "next";

import { CommandHero } from "@/components/dashboard/CommandHero";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard — AIWOS",
};

export default function DashboardPage() {
  return (
    <div className="min-h-full">
      <CommandHero />
      <DashboardContent />
    </div>
  );
}
