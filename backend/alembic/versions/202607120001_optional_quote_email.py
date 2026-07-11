"""make quote request email optional

Revision ID: 202607120001
Revises: 202607110001
Create Date: 2026-07-12
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "202607120001"
down_revision: str | None = "202607110001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column("quote_requests", "email", existing_type=sa.String(length=255), nullable=True)


def downgrade() -> None:
    op.alter_column("quote_requests", "email", existing_type=sa.String(length=255), nullable=False)
