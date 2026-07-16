"""add brands table

Revision ID: 202607160001
Revises: 202607150004
Create Date: 2026-07-16
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "202607160001"
down_revision = "202607150004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "brands",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=140), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=True),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_brands_created_at", "brands", ["created_at"])
    op.create_index("ix_brands_display_order", "brands", ["display_order"])
    op.create_index("ix_brands_id", "brands", ["id"])
    op.create_index("ix_brands_is_active", "brands", ["is_active"])
    op.create_index("ix_brands_name", "brands", ["name"])
    op.create_index("ix_brands_slug", "brands", ["slug"])

    op.execute(
        """
        INSERT INTO brands (id, name, slug, image_url, description, display_order, is_active)
        SELECT
            (
                substr(md5(brand_name), 1, 8) || '-' ||
                substr(md5(brand_name), 9, 4) || '-' ||
                substr(md5(brand_name), 13, 4) || '-' ||
                substr(md5(brand_name), 17, 4) || '-' ||
                substr(md5(brand_name), 21, 12)
            )::uuid,
            brand_name,
            CASE
                WHEN slug_count = 1 THEN slug_base
                ELSE slug_base || '-' || slug_rank
            END,
            NULL,
            '',
            row_number() OVER (ORDER BY brand_name),
            true
        FROM (
            SELECT
                brand_name,
                slug_base,
                count(*) OVER (PARTITION BY slug_base) AS slug_count,
                row_number() OVER (PARTITION BY slug_base ORDER BY brand_name) AS slug_rank
            FROM (
                SELECT DISTINCT
                    upper(trim(brand)) AS brand_name,
                    trim(both '-' from regexp_replace(lower(trim(brand)), '[^a-z0-9]+', '-', 'g')) AS slug_base
                FROM products
                WHERE brand IS NOT NULL AND trim(brand) <> ''
            ) deduped
        ) source
        ON CONFLICT (name) DO NOTHING
        """
    )


def downgrade() -> None:
    op.drop_index("ix_brands_slug", table_name="brands")
    op.drop_index("ix_brands_name", table_name="brands")
    op.drop_index("ix_brands_is_active", table_name="brands")
    op.drop_index("ix_brands_id", table_name="brands")
    op.drop_index("ix_brands_display_order", table_name="brands")
    op.drop_index("ix_brands_created_at", table_name="brands")
    op.drop_table("brands")
