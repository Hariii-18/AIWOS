import uuid
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.agent import Agent
from app.models.user import User
from app.schemas.agent import AgentCreate, AgentResponse, AgentUpdate
from app.services.agent_service import (
    create_agent,
    delete_agent,
    get_agent,
    list_agents,
    update_agent,
)

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create(
    body: AgentCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Agent:
    return await create_agent(db, body)


@router.get("", response_model=List[AgentResponse])
async def list_all(
    organization_id: uuid.UUID,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> List[Agent]:
    return await list_agents(db, organization_id, skip=skip, limit=limit)


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_one(
    agent_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Agent:
    return await get_agent(db, agent_id)


@router.patch("/{agent_id}", response_model=AgentResponse)
async def update_one(
    agent_id: uuid.UUID,
    body: AgentUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Agent:
    return await update_agent(db, agent_id, body)


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_one(
    agent_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    await delete_agent(db, agent_id)
