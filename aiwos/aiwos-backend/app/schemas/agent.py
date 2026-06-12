import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

AgentStatus = Literal["Created", "Active", "Paused", "Retired"]


class AgentCreate(BaseModel):
    organization_id: uuid.UUID
    department_id: uuid.UUID | None = None
    name: str = Field(min_length=1, max_length=255)
    role: str = Field(min_length=1, max_length=255)
    goal: str
    instructions: str
    memory_config: Any | None = None
    tools: list[Any] = Field(default_factory=list)
    permissions: Any | None = None
    status: AgentStatus = "Created"
    is_manager: bool = False


class AgentUpdate(BaseModel):
    department_id: uuid.UUID | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    role: str | None = Field(default=None, min_length=1, max_length=255)
    goal: str | None = None
    instructions: str | None = None
    memory_config: Any | None = None
    tools: list[Any] | None = None
    permissions: Any | None = None
    status: AgentStatus | None = None
    is_manager: bool | None = None


class AgentResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    department_id: uuid.UUID | None
    name: str
    role: str
    goal: str
    instructions: str
    memory_config: Any | None
    tools: Any
    permissions: Any | None
    status: str
    is_manager: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
