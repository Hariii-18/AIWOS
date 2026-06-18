"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CONVERSATIONS, MESSAGES } from "@/lib/data/chat";
import type { Message, Conversation, ProjectRecommendationMetadata } from "@/lib/data/chat";
import { ConversationSidebar, avatarGradient, agentInitials } from "@/components/chat/ConversationSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { useAuthStore } from "@/lib/store/auth";
import { useWorkspaceStore } from "@/lib/store/workspace";
import { agentApi, type AgentApiResponse } from "@/lib/api/agents";
import { conversationApi } from "@/lib/api/conversations";
import type { ConversationResponse } from "@/lib/api/conversations";

// An agent reply is pending whenever the last message is from the user
function isAwaitingAgentReply(conv: ConversationResponse | undefined): boolean {
  if (!conv || conv.messages.length === 0) return false;
  return conv.messages[conv.messages.length - 1].sender_type === "user";
}

// ---------------------------------------------------------------------------
// Project recommendation detection
// ---------------------------------------------------------------------------

const _GENERIC_HEADINGS = new Set([
  "plan", "overview", "summary", "approach", "analysis",
  "response", "implementation", "recommendations", "next steps",
  "background", "context", "conclusion",
]);

function detectProjectRecommendation(
  content: string,
): ProjectRecommendationMetadata | null {
  const hasPlanSection = /^##\s+plan\b/im.test(content);
  const bulletItems = content.match(/^[-*]\s+\S[^\n]*/gm) ?? [];
  const hasEnoughTasks = bulletItems.length >= 3;

  if (!hasPlanSection && !hasEnoughTasks) return null;

  // Project name: first ## heading that isn't a generic section word
  let name = "New Project";
  for (const match of content.matchAll(/^##\s+(.+)/gm)) {
    const title = match[1].trim();
    if (!_GENERIC_HEADINGS.has(title.toLowerCase())) {
      name = title;
      break;
    }
  }

  // Description: first non-empty, non-heading prose line (≥ 20 chars)
  const descMatch = content.match(/^(?!#)(?![-*\d])([A-Z][^\n]{19,})/m);
  const description = descMatch?.[1]?.trim() ?? "";

  // Up to 5 tasks — strip markdown bold markers for clean display
  const tasks = bulletItems
    .slice(0, 5)
    .map((item) => item.replace(/^[-*]\s+/, "").replace(/\*\*/g, "").trim());

  return { type: "project_recommendation", name, description, tasks };
}

// ---------------------------------------------------------------------------

function apiConvToFrontend(conv: ConversationResponse): Conversation {
  const agent = conv.agent;
  const name = agent?.name ?? "Agent";
  const lastMsg = conv.messages[conv.messages.length - 1];
  return {
    id: conv.id,
    agentName: name,
    agentRole: agent?.role ?? "",
    agentInitials: agentInitials(name),
    agentColor: avatarGradient(agent?.id ?? conv.id),
    status: "online",
    lastMessage: lastMsg?.content.slice(0, 80) ?? conv.title,
    lastMessageAt: lastMsg
      ? new Date(lastMsg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
    unread: 0,
  };
}

function apiMsgsToFrontend(conv: ConversationResponse): Message[] {
  return conv.messages.map((m) => {
    const isAgent = m.sender_type === "agent";
    return {
      id: m.id,
      conversationId: conv.id,
      sender: isAgent ? "agent" : "user",
      content: m.content,
      timestamp: new Date(m.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      metadata: isAgent ? detectProjectRecommendation(m.content) : null,
    };
  });
}

export default function ChatPage() {
  const { user, currentOrgId } = useAuthStore();

  if (user?.isGuest) return <GuestChatPage />;
  if (!currentOrgId) return <NeedOrgState />;
  return <AuthenticatedChatPage orgId={currentOrgId} />;
}

// ── No org ──────────────────────────────────────────────────────────────────

function NeedOrgState() {
  return (
    <div
      className="flex h-full items-center justify-center rounded-xl border"
      style={{
        background: "var(--card)",
        borderColor: "var(--border-light)",
        height: "calc(100svh - 88px)",
      }}
    >
      <p className="text-sm text-muted-foreground">
        No organization found. Please sign in to an account with an organization.
      </p>
    </div>
  );
}

// ── Guest (mock data) ────────────────────────────────────────────────────────

function GuestChatPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [extraMessages, setExtraMessages] = useState<Message[]>([]);
  const [mobileView, setMobileView] = useState<"sidebar" | "chat">("sidebar");

  const allMessages = [...MESSAGES, ...extraMessages];
  const activeMessages = allMessages.filter((m) => m.conversationId === selectedId);
  const selectedConversation = CONVERSATIONS.find((c) => c.id === selectedId) ?? null;

  function handleSend(conversationId: string, content: string) {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setExtraMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, conversationId, sender: "user", content, timestamp },
    ]);
  }

  // Derive fake agents from mock conversations for the sidebar
  const fakeAgents: AgentApiResponse[] = CONVERSATIONS.map((c) => ({
    id: c.id,
    organization_id: "guest",
    department_id: null,
    name: c.agentName,
    role: c.agentRole,
    goal: "",
    instructions: "",
    skills: [],
    provider: null,
    model: null,
    memory_config: null,
    tools: [],
    permissions: null,
    status: "Active",
    is_manager: false,
    created_at: "",
    updated_at: "",
  }));

  // Derive fake conversations for the sidebar's last-message preview
  const fakeConvs: ConversationResponse[] = CONVERSATIONS.map((c) => {
    const msgs = MESSAGES.filter((m) => m.conversationId === c.id);
    const lastMsg = msgs[msgs.length - 1];
    return {
      id: c.id,
      organization_id: "guest",
      user_id: null,
      agent_id: c.id,
      title: c.agentName,
      context_type: "agent",
      context_id: null,
      created_at: "",
      updated_at: lastMsg?.timestamp ?? "",
      messages: lastMsg
        ? [{
            id: lastMsg.id,
            conversation_id: c.id,
            sender_type: lastMsg.sender === "user" ? "user" : "agent",
            sender_id: c.id,
            content: lastMsg.content,
            payload: null,
            execution_id: null,
            created_at: lastMsg.timestamp,
          }]
        : [],
      agent: {
        id: c.id,
        name: c.agentName,
        role: c.agentRole,
        status: "Active",
        provider: null,
        model: null,
      },
    };
  });

  return (
    <ChatShell
      agents={fakeAgents}
      conversations={fakeConvs}
      selectedAgentId={selectedId}
      selectedConvId={selectedId}
      messages={activeMessages}
      selectedConversation={selectedConversation}
      mobileView={mobileView}
      isCreatingConv={false}
      isExecuting={false}
      onAgentSelect={(id) => { setSelectedId(id); setMobileView("chat"); }}
      onSend={handleSend}
      onBack={() => setMobileView("sidebar")}
    />
  );
}

// ── Authenticated ────────────────────────────────────────────────────────────

function AuthenticatedChatPage({ orgId }: { orgId: string }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [isCreatingConv, setIsCreatingConv] = useState(false);
  const [mobileView, setMobileView] = useState<"sidebar" | "chat">("sidebar");
  const pendingHandled = useRef(false);

  const { pendingConversationId, setPendingConversationId } = useWorkspaceStore();

  // Load all agents for the sidebar
  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ["agents", orgId],
    queryFn: () => agentApi.list(orgId),
    enabled: !!orgId,
    staleTime: 60_000,
  });

  // Load all conversations for last-message previews
  const { data: allConversations = [] } = useQuery({
    queryKey: ["conversations", orgId],
    queryFn: () => conversationApi.list({ organization_id: orgId, limit: 100 }),
    enabled: !!orgId,
    staleTime: 30_000,
  });

  // Load the selected conversation with messages (+ polling while awaiting reply)
  const { data: selectedApiConv } = useQuery({
    queryKey: ["conversation", selectedConvId],
    queryFn: () => conversationApi.get(selectedConvId!),
    enabled: !!selectedConvId,
    staleTime: 10_000,
    refetchInterval: (query) =>
      isAwaitingAgentReply(query.state.data as ConversationResponse | undefined)
        ? 2000
        : false,
  });

  // Handle pending conversation arriving from the dashboard
  useEffect(() => {
    if (pendingConversationId && !pendingHandled.current) {
      pendingHandled.current = true;
      setPendingConversationId(null);

      // Find the agent for this conversation and select both
      conversationApi.get(pendingConversationId).then((conv) => {
        if (conv.agent_id) setSelectedAgentId(conv.agent_id);
        setSelectedConvId(pendingConversationId);
        setMobileView("chat");
        queryClient.invalidateQueries({ queryKey: ["conversations", orgId] });
      });
    }
  }, [pendingConversationId, orgId, setPendingConversationId, queryClient]);

  async function handleAgentSelect(agentId: string) {
    setSelectedAgentId(agentId);
    setMobileView("chat");

    // Find the most recent existing conversation for this agent
    const existing = allConversations
      .filter((c) => c.agent_id === agentId)
      .sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1))[0];

    if (existing) {
      setSelectedConvId(existing.id);
      return;
    }

    // No conversation yet — create one
    setIsCreatingConv(true);
    try {
      const conv = await conversationApi.create({
        organization_id: orgId,
        agent_id: agentId,
        user_id: user?.id,
      });
      setSelectedConvId(conv.id);
      queryClient.invalidateQueries({ queryKey: ["conversations", orgId] });
    } catch (e) {
      console.error("Failed to create conversation:", e);
    } finally {
      setIsCreatingConv(false);
    }
  }

  const sendMessage = useMutation({
    mutationFn: async ({ convId, content }: { convId: string; content: string }) => {
      return conversationApi.sendMessage(convId, content);
    },
    onSuccess: (_msgs, { convId }) => {
      queryClient.invalidateQueries({ queryKey: ["conversation", convId] });
      queryClient.invalidateQueries({ queryKey: ["conversations", orgId] });
    },
    onError: (_err, { convId }) => {
      queryClient.invalidateQueries({ queryKey: ["conversation", convId] });
    },
  });

  function handleSend(conversationId: string, content: string) {
    // Optimistic update — flips isAwaitingAgentReply immediately
    queryClient.setQueryData<ConversationResponse>(
      ["conversation", conversationId],
      (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: `optimistic-${Date.now()}`,
              conversation_id: conversationId,
              sender_type: "user",
              sender_id: user?.id ?? "",
              content,
              payload: null,
              execution_id: null,
              created_at: new Date().toISOString(),
            },
          ],
        };
      },
    );
    sendMessage.mutate({ convId: conversationId, content });
  }

  const activeMessages: Message[] = selectedApiConv ? apiMsgsToFrontend(selectedApiConv) : [];

  const selectedConversation: Conversation | null = selectedApiConv
    ? apiConvToFrontend(selectedApiConv)
    : null;

  if (agentsLoading) {
    return (
      <div
        className="flex h-full items-center justify-center rounded-xl border"
        style={{
          background: "var(--card)",
          borderColor: "var(--border-light)",
          height: "calc(100svh - 88px)",
        }}
      >
        <p className="text-sm text-muted-foreground">Loading agents…</p>
      </div>
    );
  }

  return (
    <ChatShell
      agents={agents}
      conversations={allConversations}
      selectedAgentId={selectedAgentId}
      selectedConvId={selectedConvId}
      messages={activeMessages}
      selectedConversation={selectedConversation}
      mobileView={mobileView}
      isCreatingConv={isCreatingConv}
      isExecuting={isAwaitingAgentReply(selectedApiConv)}
      onAgentSelect={(id) => handleAgentSelect(id)}
      onSend={handleSend}
      onBack={() => setMobileView("sidebar")}
    />
  );
}

// ── Shared shell ─────────────────────────────────────────────────────────────

interface ChatShellProps {
  agents: AgentApiResponse[];
  conversations: ConversationResponse[];
  selectedAgentId: string | null;
  selectedConvId: string | null;
  messages: Message[];
  selectedConversation: Conversation | null;
  mobileView: "sidebar" | "chat";
  isCreatingConv: boolean;
  isExecuting: boolean;
  onAgentSelect: (agentId: string) => void;
  onSend: (conversationId: string, content: string) => void;
  onBack: () => void;
}

function ChatShell({
  agents,
  conversations,
  selectedAgentId,
  selectedConvId,
  messages,
  selectedConversation,
  mobileView,
  isCreatingConv,
  isExecuting,
  onAgentSelect,
  onSend,
  onBack,
}: ChatShellProps) {
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
        {/* Agent sidebar */}
        <div
          className={`h-full w-full shrink-0 md:block md:w-72 lg:w-80 ${
            mobileView === "chat" ? "hidden" : "block"
          }`}
          style={{ background: "var(--surface)" }}
        >
          <ConversationSidebar
            agents={agents}
            conversations={conversations}
            selectedAgentId={selectedAgentId}
            isCreating={isCreatingConv}
            onSelect={onAgentSelect}
          />
        </div>

        {/* Chat area */}
        <div
          className={`h-full min-w-0 flex-1 ${
            mobileView === "sidebar" ? "hidden md:flex md:flex-col" : "flex flex-col"
          }`}
        >
          {isCreatingConv && !selectedConvId ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground animate-pulse">
                Opening conversation…
              </p>
            </div>
          ) : (
            <ChatArea
              conversation={selectedConversation}
              messages={messages}
              onBack={onBack}
              onSend={onSend}
              isExecuting={isExecuting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
