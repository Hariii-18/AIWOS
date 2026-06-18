"""Agent: add skills column for expertise/specialization identity

Revision ID: f1a2b3c4d5e6
Revises: e5f3d6a7b8c9
Create Date: 2026-06-18

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB

revision: str = "f1a2b3c4d5e6"
down_revision: Union[str, Sequence[str], None] = "e5f3d6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "agents",
        sa.Column("skills", JSONB, nullable=False, server_default="[]"),
    )


def downgrade() -> None:
    op.drop_column("agents", "skills")
