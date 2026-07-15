"""remove product payout columns

Revision ID: 202607150002
Revises: 202607150001
Create Date: 2026-07-15
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "202607150002"
down_revision: str | None = "202607150001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_column("products", "payout_min")
    op.drop_column("products", "payout_max")


def downgrade() -> None:
    op.add_column("products", sa.Column("payout_min", sa.Numeric(10, 2), nullable=True))
    op.add_column("products", sa.Column("payout_max", sa.Numeric(10, 2), nullable=True))
