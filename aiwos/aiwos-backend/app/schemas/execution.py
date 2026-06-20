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
        return self
