"""
Conversation service: create conversations, send messages, and maintain
multi-turn LLM context from stored history.

Every conversation belongs to exactly one agent — agent_id is required.
LLM execution runs as a FastAPI background task *after* the HTTP response is
sent, so POST /conversations and POST .../messages return as soon as the
conversation/user-message rows exist — they never block on a provider call.
"""
import asyncio
import logging
import uuid
from typing import List, Optional, Tuple

from fastapi import BackgroundTasks, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import AsyncSessionLocal
from app.models.agent import Agent
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.conversation import ConversationCreate
from app.services.llm_provider_service import complete as llm_complete

log = logging.getLogger(__name__)

_HISTORY_WINDOW = 20   # prior messages to include as context
_FALLBACK_MODEL = "gemini-2.5-flash"


# ── Internal helpers ──────────────────────────────────────────────────────────

async def _get_conversation(db: AsyncSession, conversation_id: uuid.UUID) -> Conversation:
    result = await db.execute(
        select(Conversation)
        .options(selectinload(Conversation.messages))
        .where(
            Conversation.id == conversation_id,
            Conversation.deleted_at.is_(None),
        )
    )
    conv = result.scalar_one_or_none()
    if conv is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    return conv


async def _get_agent(db: AsyncSession, agent_id: uuid.UUID) -> Agent:
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.deleted_at.is_(None))
    )
    agent = result.scalar_one_or_none()
    if agent is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found.")
    return agent


def _build_system_prompt(agent: Agent) -> str:
    """
    Construct a rich, identity-first system prompt from the agent's profile.
    The model receives a clear persona so every response reflects the agent's
    specialization — not a generic assistant.
    """
    skills: list = agent.skills if isinstance(agent.skills, list) else []

    lines = [
        f"You are {agent.name}, {agent.role}.",
        "",
        "## Your Identity",
        f"- Name: {agent.name}",
        f"- Role: {agent.role}",
    ]

    if skills:
        lines.append(f"- Core Skills: {', '.join(skills)}")

    if agent.goal:
        lines += ["", "## Your Purpose", agent.goal]

    if agent.instructions:
        lines += ["", "## How You Operate", agent.instructions]

    if skills:
        lines += [
            "",
            "## Areas of Expertise",
            "\n".join(f"- {s}" for s in skills),
        ]

    lines += [
        "",
        "## Behavioral Standards",
        f"- Always respond as {agent.name} — maintain your persona throughout every message",
        "- Draw on your specific expertise and domain knowledge in every response",
        "- Provide detailed, actionable, and professional guidance",
        "- Be direct, confident, and specific — avoid vague or generic advice",
        "- If a question falls outside your domain, acknowledge it and redirect appropriately",
        "- Structure longer responses with clear sections or bullet points",
        "- Remember the full conversation history and build on it coherently",
    ]

    return "\n".join(lines)


def _build_user_prompt(content: str, history: List[Message]) -> str:
    """Prepend the last N messages as labelled conversation history."""
    if not history:
        return content
    lines = []
    for msg in history:
        role = "User" if msg.sender_type == "user" else "Assistant"
        lines.append(f"{role}: {msg.content}")
    context = "\n".join(lines)
    return f"Conversation history:\n{context}\n\nUser: {content}\nAssistant:"


async def _call_llm(agent: Agent, user_prompt: str) -> Tuple[str, Optional[dict]]:
    """
    Call the LLM and return (content, payload).
    payload stores token/cost metadata for the message record.
    Never raises — returns an error string on failure.
    """
    model = agent.model or _FALLBACK_MODEL
    system_prompt = _build_system_prompt(agent)
    try:
        response = await llm_complete(
            model=model,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )
        payload = {
            "model": model,
            "input_tokens": response.input_tokens,
            "output_tokens": response.output_tokens,
            "cost": float(response.cost),
        }
        return response.content, payload
    except Exception as exc:
        log.error("LLM call failed for agent=%s model=%s: %s", agent.id, model, exc)
        return f"I encountered an error processing your request: {exc}", None


# ── Public API ────────────────────────────────────────────────────────────────

async def create_conversation(
    db: AsyncSession,
    body: ConversationCreate,
    background_tasks: Optional[BackgroundTasks] = None,
) -> Conversation:
    """
    Create a conversation for a specific agent.

    agent_id is required — conversations must belong to an explicit agent.
    If prompt is provided it is saved as the first user message immediately
    and the agent's reply is generated in the background — this call never
    waits on an LLM provider.
    """
    if not body.agent_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="agent_id is required. Select an agent before starting a conversation.",
        )

    agent = await _get_agent(db, body.agent_id)

    title = (body.title or (body.prompt or f"Chat with {agent.name}")[:80]).strip()
    if not title:
        title = f"Chat with {agent.name}"

    conv = Conversation(
        id=uuid.uuid4(),
        organization_id=body.organization_id,
        user_id=body.user_id,
        agent_id=agent.id,
        context_type="agent",
        context_id=agent.id,
        title=title,
    )
    db.add(conv)
    await db.commit()
    await db.refresh(conv)

    # Save the first user message (if any) and schedule the agent reply.
    if body.prompt:
        effective_user_id = body.user_id or uuid.UUID("00000000-0000-0000-0000-000000000001")
        user_msg = Message(
            id=uuid.uuid4(),
            organization_id=conv.organization_id,
            conversation_id=conv.id,
            sender_type="user",
            sender_id=effective_user_id,
            content=body.prompt,
        )
        db.add(user_msg)
        await db.commit()

        _schedule_agent_reply(
            background_tasks,
            conversation_id=conv.id,
            organization_id=conv.organization_id,
            agent_id=agent.id,
            content=body.prompt,
            prior_messages=[],
        )

        result = await db.execute(
            select(Conversation)
            .options(selectinload(Conversation.messages))
            .where(Conversation.id == conv.id)
        )
        conv = result.scalar_one()

    return conv


async def send_message(
    db: AsyncSession,
    conversation_id: uuid.UUID,
    content: str,
    user_id: Optional[uuid.UUID] = None,
    background_tasks: Optional[BackgroundTasks] = None,
) -> List[Message]:
    """
    Append a user message and schedule the agent's reply in the background.
    Returns [user_message] immediately — the agent message is saved once the
    background task finishes and shows up on the next poll/refetch.
    """
    conv = await _get_conversation(db, conversation_id)
    if not conv.agent_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Conversation has no agent assigned.",
        )
    agent = await _get_agent(db, conv.agent_id)

    # Gather recent history before adding the new one
    prior = list(conv.messages)[-_HISTORY_WINDOW:]
    effective_user_id = user_id or conv.user_id or uuid.UUID("00000000-0000-0000-0000-000000000001")

    user_msg = Message(
        id=uuid.uuid4(),
        organization_id=conv.organization_id,
        conversation_id=conv.id,
        sender_type="user",
        sender_id=effective_user_id,
        content=content,
    )
    db.add(user_msg)
    await db.commit()
    await db.refresh(user_msg)

    _schedule_agent_reply(
        background_tasks,
        conversation_id=conv.id,
        organization_id=conv.organization_id,
        agent_id=agent.id,
        content=content,
        prior_messages=prior,
    )

    return [user_msg]


# ── Background LLM execution ─────────────────────────────────────────────────

def _schedule_agent_reply(
    background_tasks: Optional[BackgroundTasks],
    *,
    conversation_id: uuid.UUID,
    organization_id: uuid.UUID,
    agent_id: uuid.UUID,
    content: str,
    prior_messages: List[Message],
) -> None:
    kwargs = dict(
        conversation_id=conversation_id,
        organization_id=organization_id,
        agent_id=agent_id,
        content=content,
        prior_messages=prior_messages,
    )
    if background_tasks is not None:
        background_tasks.add_task(_generate_agent_reply, **kwargs)
    else:
        asyncio.create_task(_generate_agent_reply(**kwargs))


async def _generate_agent_reply(
    *,
    conversation_id: uuid.UUID,
    organization_id: uuid.UUID,
    agent_id: uuid.UUID,
    content: str,
    prior_messages: List[Message],
) -> None:
    """
    Background task body: call the LLM and save the agent's message.
    Opens its own session (the request session is already closed).
    Never raises — failures are logged and saved as a visible error message.
    """
    async with AsyncSessionLocal() as db:
        try:
            agent = await _get_agent(db, agent_id)
        except HTTPException:
            log.error(
                "Background agent reply skipped: agent %s not found (conversation=%s)",
                agent_id, conversation_id,
            )
            return

        user_prompt = _build_user_prompt(content, prior_messages)
        agent_content, payload = await _call_llm(agent, user_prompt)

        agent_msg = Message(
            id=uuid.uuid4(),
            organization_id=organization_id,
            conversation_id=conversation_id,
            sender_type="agent",
            sender_id=agent.id,
            content=agent_content,
            payload=payload,
        )
        db.add(agent_msg)
        await db.commit()
        log.info(
            "Saved background agent reply for conversation=%s agent=%s",
            conversation_id, agent_id,
        )


async def list_conversations(
    db: AsyncSession,
    organization_id: uuid.UUID,
    agent_id: Optional[uuid.UUID] = None,
    user_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[Conversation]:
    q = (
        select(Conversation)
        .options(selectinload(Conversation.messages))
        .where(
            Conversation.organization_id == organization_id,
            Conversation.deleted_at.is_(None),
        )
        .order_by(Conversation.updated_at.desc())
        .offset(skip)
        .limit(limit)
    )
    if agent_id:
        q = q.where(Conversation.agent_id == agent_id)
    if user_id:
        q = q.where(Conversation.user_id == user_id)
    result = await db.execute(q)
    return list(result.scalars().all())


async def get_conversation_with_messages(
    db: AsyncSession, conversation_id: uuid.UUID
) -> Conversation:
    result = await db.execute(
        select(Conversation)
        .options(selectinload(Conversation.messages))
        .where(
            Conversation.id == conversation_id,
            Conversation.deleted_at.is_(None),
        )
    )
    conv = result.scalar_one_or_none()
    if conv is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    return conv


async def get_messages(
    db: AsyncSession,
    conversation_id: uuid.UUID,
    skip: int = 0,
    limit: int = 200,
) -> List[Message]:
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())
