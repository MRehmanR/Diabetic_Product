"""add product brand

Revision ID: 202607150003
Revises: 202607150002
Create Date: 2026-07-15
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "202607150003"
down_revision: str | None = "202607150002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("products", sa.Column("brand", sa.String(length=120), nullable=False, server_default="Other"))
    op.create_index("ix_products_brand", "products", ["brand"])
    op.execute(
        """
        UPDATE products
        SET brand = CASE
            WHEN lower(name) LIKE '%dexcom%' THEN 'DEXCOM'
            WHEN lower(name) LIKE '%omnipod%' THEN 'OMNIPOD'
            WHEN lower(name) LIKE '%freestyle%' OR lower(name) LIKE '%libre%' THEN 'FREESTYLE'
            WHEN lower(name) LIKE '%one touch%' OR lower(name) LIKE '%onetouch%' THEN 'ONE TOUCH'
            WHEN lower(name) LIKE '%medtronic%' OR lower(name) LIKE '%minimed%' THEN 'MEDTRONIC'
            WHEN lower(name) LIKE '%accu-chek%' OR lower(name) LIKE '%accu chek%' THEN 'ACCU-CHEK'
            WHEN lower(name) LIKE '%contour%' THEN 'CONTOUR NEXT'
            ELSE 'Other'
        END
        """
    )
    op.alter_column("products", "brand", server_default=None)


def downgrade() -> None:
    op.drop_index("ix_products_brand", table_name="products")
    op.drop_column("products", "brand")
