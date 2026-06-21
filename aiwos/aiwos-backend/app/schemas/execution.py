import uuid
from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, model_validator

ExecutionStatus = Literal["pending", "running", "completed", "failed", "cancelled"]


class KnowledgeChunkRef(BaseModel):
    """Metadata for a single knowledge chunk used during execution."""
    file_name: str
    file_id: str
    chunk_index: int
    relevance_score: float


class DependencyRef(BaseModel):
    """Reference to a prior-phase execution used as dependency context."""
    execution_id: str
    task_title: str
    task_phase: Optional[str] = None


class ExecuteTaskRequest(BaseModel):
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "agent_id": "<agent_uuid>",
        }
    })

    agent_id: Optional[uuid.UUID] = None


class ExecuteTaskResponse(BaseModel):
    execution_id: uuid.UUID
    status: ExecutionStatus


class ExecutionResponse(BaseModel):
    id: uuid.UUID
    task_id: uuid.UUID
    agent_id: Optional[uuid.UUID]
    organization_id: uuid.UUID
    status: str
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    output_data: Optional[Any]
    error_message: Optional[str]
    token_count: int
    cost: float
    execution_time_ms: Optional[int]
    retry_count: int
    created_at: datetime
    updated_at: datetime

    # Populated from output_data JSONB; no DB migration needed
    provider_used: Optional[str] = None
    fallback_provider: Optional[str] = None
    error_type: Optional[str] = None
    knowledge_chunks_used: Optional[list[KnowledgeChunkRef]] = None
    dependency_ids: Optional[list[str]] = None
    dependency_count: Optional[int] = None
    dependency_context_used: Optional[bool] = None
    dependencies_used: Optional[list[DependencyRef]] = None

    model_config = {"from_attributes": True}

    @model_validator(mode="after")
    def _extract_output_metadata(self) -> "ExecutionResponse":
        if isinstance(self.output_data, dict):
            if self.provider_used is None:
                self.provider_used = self.output_data.get("provider_used")
            if self.fallback_provider is None:
                self.fallback_provider = self.output_data.get("fallback_provider")
            if self.error_type is None:
                self.error_type = self.output_data.get("error_type")
            if self.knowledge_chunks_used is None:
                raw = self.output_data.get("knowledge_chunks_used")
                if raw:
                    self.knowledge_chunks_used = [
                        KnowledgeChunkRef(**c) for c in raw
                    ]
            if self.dependency_ids is None:
                self.dependency_ids = self.output_data.get("dependency_ids")
            if self.dependency_count is None:
                self.dependency_count = self.output_data.get("dependency_count")
            if self.dependency_context_used is None:
                self.dependency_context_used = self.output_data.get("dependency_context_used")
            if self.dependencies_used is None:
                raw_deps = self.output_data.get("dependencies_used")
                if raw_deps:
                    self.dependencies_used = [DependencyRef(**d) for d in raw_deps]
        return self
