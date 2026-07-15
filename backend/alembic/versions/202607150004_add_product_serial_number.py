"""add product serial number

Revision ID: 202607150004
Revises: 202607150003
Create Date: 2026-07-15
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "202607150004"
down_revision: str | None = "202607150003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("products", sa.Column("serial_number", sa.String(length=120), nullable=True))
    op.create_index("ix_products_serial_number", "products", ["serial_number"])


def downgrade() -> None:
    op.drop_index("ix_products_serial_number", table_name="products")
    op.drop_column("products", "serial_number")
