import re
from typing import Any
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import Select, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.blog_post import BlogPost
from app.schemas.blog import BlogCreate, BlogUpdate


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "blog-post"


async def unique_slug(db: AsyncSession, title: str, requested_slug: str | None = None, exclude_id: UUID | None = None) -> str:
    base = slugify(requested_slug or title)
    slug = base
    counter = 2
    while True:
        query = select(BlogPost).where(BlogPost.slug == slug)
        if exclude_id:
            query = query.where(BlogPost.id != exclude_id)
        exists = (await db.execute(query)).scalar_one_or_none()
        if not exists:
            return slug
        slug = f"{base}-{counter}"
        counter += 1


def apply_blog_filters(query: Select[tuple[BlogPost]], search: str | None, published_only: bool):
    if search:
        pattern = f"%{search}%"
        query = query.where(or_(BlogPost.title.ilike(pattern), BlogPost.excerpt.ilike(pattern), BlogPost.content.ilike(pattern)))
    if published_only:
        query = query.where(BlogPost.is_published.is_(True), BlogPost.status == "published")
    return query


async def list_blogs(db: AsyncSession, search: str | None = None, published_only: bool = True):
    query = apply_blog_filters(select(BlogPost), search, published_only).order_by(BlogPost.created_at.desc())
    return (await db.execute(query)).scalars().all()


async def get_by_slug(db: AsyncSession, slug: str, published_only: bool = True) -> BlogPost:
    query = select(BlogPost).where(BlogPost.slug == slug)
    if published_only:
        query = query.where(BlogPost.is_published.is_(True), BlogPost.status == "published")
    post = (await db.execute(query)).scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


async def get_by_id(db: AsyncSession, post_id: UUID) -> BlogPost:
    post = (await db.execute(select(BlogPost).where(BlogPost.id == post_id))).scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


async def create_blog(db: AsyncSession, payload: BlogCreate) -> BlogPost:
    data = payload.model_dump()
    data["slug"] = await unique_slug(db, payload.title, payload.slug)
    data["excerpt"] = data.get("excerpt") or data["content"][:180]
    data["status"] = "published" if data.get("is_published", True) else "draft"
    post = BlogPost(**data)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post


async def update_blog(db: AsyncSession, post_id: UUID, payload: BlogUpdate) -> BlogPost:
    post = await get_by_id(db, post_id)
    data: dict[str, Any] = payload.model_dump(exclude_unset=True)
    if "title" in data or "slug" in data:
        data["slug"] = await unique_slug(db, data.get("title", post.title), data.get("slug", post.slug), post.id)
    if data.get("excerpt") == "" and "content" in data:
        data["excerpt"] = data["content"][:180]
    if "is_published" in data and "status" not in data:
        data["status"] = "published" if data["is_published"] else "draft"
    for key, value in data.items():
        setattr(post, key, value)
    await db.commit()
    await db.refresh(post)
    return post


async def delete_blog(db: AsyncSession, post_id: UUID) -> None:
    post = await get_by_id(db, post_id)
    await db.delete(post)
    await db.commit()
