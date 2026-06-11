"use client";

import { useMemo, useState } from "react";
import { CONVERSATIONS, MESSAGES } from "@/lib/data/chat";
import type { Message } from "@/lib/data/chat";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatArea } from "@/components/chat/ChatArea";

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState<string | null>("conv-1");
  const [extraMessages, setExtraMessages] = useState<Message[]>([]);
  // Mobile: "sidebar" | "chat"
  const [mobileView, setMobileView] = useState<"sidebar" | "chat">("sidebar");

  const allMessages = useMemo(
    () => [...MESSAGES, ...extraMessages],
    [extraMessages],
  );

  const activeMessages = useMemo(
    () => allMessages.filter((m) => m.conversationId === selectedId),
    [allMessages, selectedId],
  );

  const selectedConversation = useMemo(
    () => CONVERSATIONS.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  function handleSelect(id: string) {
    setSelectedId(id);
    setMobileView("chat");
  }

  function handleSend(conversationId: string, content: string) {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setExtraMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        conversationId,
        sender: "user",
        content,
        timestamp,
      },
    ]);
  }

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{
        background: "var(--card)",
        borderColor: "var(--border-light)",
        height: "calc(100svh - 88px)",
      }}
    >
      <div className="flex h-full">
        {/* Sidebar — hidden on mobile when chat is active */}
        <div
          className={`h-full w-full shrink-0 md:block md:w-72 lg:w-80 ${
            mobileView === "chat" ? "hidden" : "block"
          }`}
          style={{ background: "var(--surface)" }}
        >
          <ConversationSidebar
            conversations={CONVERSATIONS}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        {/* Chat area — full width on mobile when active */}
        <div
          className={`h-full min-w-0 flex-1 ${
            mobileView === "sidebar" ? "hidden md:flex md:flex-col" : "flex flex-col"
          }`}
        >
          <ChatArea
            conversation={selectedConversation}
            messages={activeMessages}
            onBack={() => setMobileView("sidebar")}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}
