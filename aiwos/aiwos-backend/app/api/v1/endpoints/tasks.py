import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.task import Task
from app.models.user import User
from app.models.organization_member import OrganizationMember
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services.task_service import (
    create_task,
    delete_task,
    get_task,
    list_tasks,
    list_tasks_by_org,
    update_task,
)

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create(
    body: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Task:
    return await create_task(db, body, current_user.id)


@router.get("", response_model=List[TaskResponse])
async def list_all(
    project_id: Optional[uuid.UUID] = None,
    organization_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[Task]:
    if organization_id is not None:
        # Enforce organization membership check
        member_check = await db.execute(
            select(OrganizationMember).where(
                OrganizationMember.organization_id == organization_id,
                OrganizationMember.user_id == current_user.id,
            )
        )
        if member_check.scalar_one_or_none() is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this organization.",
            )
        return await list_tasks_by_org(db, organization_id, skip=skip, limit=limit)

    if project_id is not None:
        return await list_tasks(db, project_id, skip=skip, limit=limit)

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Either organization_id or project_id must be provided.",
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_one(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Task:
    return await get_task(db, task_id)


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_one(
    task_id: uuid.UUID,
    body: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Task:
    return await update_task(db, task_id, body)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_one(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    await delete_task(db, task_id)
