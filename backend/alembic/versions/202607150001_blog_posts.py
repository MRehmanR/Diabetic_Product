"""add blog posts

Revision ID: 202607150001
Revises: 202607120001
Create Date: 2026-07-15
"""

from collections.abc import Sequence
from datetime import datetime, timezone
from uuid import UUID

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "202607150001"
down_revision: str | None = "202607120001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "blog_posts",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("excerpt", sa.Text(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=True),
        sa.Column("author", sa.String(length=120), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("is_published", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_blog_posts_slug", "blog_posts", ["slug"], unique=True)
    op.create_index("ix_blog_posts_status", "blog_posts", ["status"])
    op.create_index("ix_blog_posts_created_at", "blog_posts", ["created_at"])
    op.create_index("ix_blog_posts_status_created", "blog_posts", ["status", "created_at"])

    blog_posts = sa.table(
        "blog_posts",
        sa.column("id", postgresql.UUID(as_uuid=True)),
        sa.column("title", sa.String),
        sa.column("slug", sa.String),
        sa.column("excerpt", sa.Text),
        sa.column("content", sa.Text),
        sa.column("image_url", sa.Text),
        sa.column("author", sa.String),
        sa.column("status", sa.String),
        sa.column("is_published", sa.Boolean),
        sa.column("created_at", sa.DateTime(timezone=True)),
        sa.column("updated_at", sa.DateTime(timezone=True)),
    )
    now = datetime.now(timezone.utc)
    op.bulk_insert(
        blog_posts,
        [
            {
                "id": UUID("5b979f6a-7f75-48a0-8bb4-95d3a2c7a001"),
                "title": "How to Sell Unused Diabetic Supplies Safely",
                "slug": "how-to-sell-unused-diabetic-supplies-safely",
                "excerpt": "A simple guide to preparing sealed diabetic supplies for review before you request an offer.",
                "content": "Selling unused diabetic supplies starts with organization. Keep products sealed, check the expiration date, take clear photos, and share the exact brand, model, quantity, and box condition. Diabetics King reviews those details before continuing with an offer so the process stays clear and respectful.",
                "image_url": None,
                "author": "Diabetics King",
                "status": "published",
                "is_published": True,
                "created_at": now,
                "updated_at": now,
            },
            {
                "id": UUID("5b979f6a-7f75-48a0-8bb4-95d3a2c7a002"),
                "title": "What Products Usually Qualify for Buyback?",
                "slug": "what-products-usually-qualify-for-buyback",
                "excerpt": "Learn which sealed diabetes products are easiest to review for a fair offer.",
                "content": "The products that are easiest to review are sealed, unused, unexpired, and clearly labeled. Common examples include CGM sensors, test strips, Omnipod supplies, Medtronic supplies, Accu-Chek products, Contour Next supplies, and selected medicine-related diabetic products. Always send accurate photos and expiration information.",
                "image_url": None,
                "author": "Diabetics King",
                "status": "published",
                "is_published": True,
                "created_at": now,
                "updated_at": now,
            },
            {
                "id": UUID("5b979f6a-7f75-48a0-8bb4-95d3a2c7a003"),
                "title": "Why Expiration Dates Matter",
                "slug": "why-expiration-dates-matter",
                "excerpt": "Expiration dates help our team review products accurately and avoid delays.",
                "content": "Expiration dates are one of the first things reviewed. Products with longer remaining dates are usually easier to evaluate. If an item is close to expiration, expired, or missing a visible date, disclose it before shipping. Honest details help avoid delays, repricing, or rejection after inspection.",
                "image_url": None,
                "author": "Diabetics King",
                "status": "published",
                "is_published": True,
                "created_at": now,
                "updated_at": now,
            },
            {
                "id": UUID("5b979f6a-7f75-48a0-8bb4-95d3a2c7a004"),
                "title": "How Free Shipping Works",
                "slug": "how-free-shipping-works",
                "excerpt": "See what happens after your offer is reviewed and a prepaid shipping label is provided.",
                "content": "After the product details are reviewed and the offer is confirmed, Diabetics King can provide a prepaid shipping label. Pack the accepted items carefully, attach the label, and ship the package. Once it arrives, the team inspects the products before payment is completed.",
                "image_url": None,
                "author": "Diabetics King",
                "status": "published",
                "is_published": True,
                "created_at": now,
                "updated_at": now,
            },
            {
                "id": UUID("5b979f6a-7f75-48a0-8bb4-95d3a2c7a005"),
                "title": "How Sellers Get Paid",
                "slug": "how-sellers-get-paid",
                "excerpt": "Understand the payment flow after your shipment is received and inspected.",
                "content": "Payment is sent after the package is received and the contents match the submitted details. The team confirms quantity, product type, condition, and expiration information. Once inspection is complete, payment can be sent through the agreed method.",
                "image_url": None,
                "author": "Diabetics King",
                "status": "published",
                "is_published": True,
                "created_at": now,
                "updated_at": now,
            },
        ],
    )


def downgrade() -> None:
    op.drop_table("blog_posts")
