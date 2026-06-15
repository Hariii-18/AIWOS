import uuid
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services.task_service import (
    create_task,
    delete_task,
    get_task,
    list_tasks,
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
    project_id: uuid.UUID,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> List[Task]:
    return await list_tasks(db, project_id, skip=skip, limit=limit)


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
