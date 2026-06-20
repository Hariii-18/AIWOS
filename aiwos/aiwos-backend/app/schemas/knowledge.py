import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class KnowledgeFileResponse(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    name: str
    file_type: str
    file_size: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class KnowledgeChunkSearchResult(BaseModel):
    """A single retrieved knowledge chunk with its relevance score."""
    file_id: uuid.UUID
    file_name: str
    chunk_index: int
    content: str
    relevance_score: float
