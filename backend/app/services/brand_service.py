import re
from typing import Any
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandUpdate


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "brand"


async def unique_slug(
    db: AsyncSession,
    name: str,
    requested_slug: str | None = None,
    exclude_id: UUID | None = None,
) -> str:
    base = slugify(requested_slug or name)
    slug = base
    counter = 2
    while True:
        query = select(Brand).where(Brand.slug == slug)
        if exclude_id:
            query = query.where(Brand.id != exclude_id)
        exists = (await db.execute(query)).scalar_one_or_none()
        if not exists:
            return slug
        slug = f"{base}-{counter}"
        counter += 1


async def list_brands(db: AsyncSession, active_only: bool = True) -> list[Brand]:
    query = select(Brand)
    if active_only:
        query = query.where(Brand.is_active.is_(True))
    query = query.order_by(Brand.display_order.asc(), Brand.name.asc())
    return list((await db.execute(query)).scalars().all())


async def get_by_id(db: AsyncSession, brand_id: UUID) -> Brand:
    brand = (await db.execute(select(Brand).where(Brand.id == brand_id))).scalar_one_or_none()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand


async def create_brand(db: AsyncSession, payload: BrandCreate) -> Brand:
    data = payload.model_dump()
    data["name"] = data["name"].strip().upper()
    data["slug"] = await unique_slug(db, data["name"], data.get("slug"))
    data["description"] = data.get("description") or ""
    brand = Brand(**data)
    db.add(brand)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Brand name or slug already exists")
    await db.refresh(brand)
    return brand


async def update_brand(db: AsyncSession, brand_id: UUID, payload: BrandUpdate) -> Brand:
    brand = await get_by_id(db, brand_id)
    data: dict[str, Any] = payload.model_dump(exclude_unset=True)
    if "name" in data and data["name"] is not None:
        data["name"] = data["name"].strip().upper()
    if "name" in data or "slug" in data:
        data["slug"] = await unique_slug(
            db,
            data.get("name", brand.name),
            data.get("slug", brand.slug),
            brand.id,
        )
    if data.get("description") is None:
        data["description"] = ""
    for key, value in data.items():
        setattr(brand, key, value)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Brand name or slug already exists")
    await db.refresh(brand)
    return brand


async def delete_brand(db: AsyncSession, brand_id: UUID) -> None:
    brand = await get_by_id(db, brand_id)
    await db.delete(brand)
    await db.commit()
