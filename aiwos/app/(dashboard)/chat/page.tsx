import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const metadata: Metadata = {
  title: "Communications — AIWOS",
};

export default function ChatPage() {
  return (
    <PagePlaceholder
      title="Communications"
      description="Chat with your agents and manage team communications."
    />
  );
}
