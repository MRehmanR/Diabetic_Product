import re
from typing import Any
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import Select, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "product"


async def unique_slug(db: AsyncSession, name: str, requested_slug: str | None = None, exclude_id: UUID | None = None) -> str:
    base = slugify(requested_slug or name)
    slug = base
    counter = 2
    while True:
        query = select(Product).where(Product.slug == slug)
        if exclude_id:
            query = query.where(Product.id != exclude_id)
        exists = (await db.execute(query)).scalar_one_or_none()
        if not exists:
            return slug
        slug = f"{base}-{counter}"
        counter += 1


def apply_product_filters(query: Select[tuple[Product]], search: str | None, category: str | None, status_filter: str | None):
    if search:
        pattern = f"%{search}%"
        query = query.where(or_(Product.name.ilike(pattern), Product.brand.ilike(pattern), Product.short_description.ilike(pattern), Product.category.ilike(pattern)))
    if category:
        query = query.where(Product.category == category)
    if status_filter:
        query = query.where(Product.status == status_filter)
    return query


async def list_products(db: AsyncSession, page: int, page_size: int, search: str | None, category: str | None, status_filter: str | None, sort: str):
    query = apply_product_filters(select(Product), search, category, status_filter)
    count_query = apply_product_filters(select(func.count()).select_from(Product), search, category, status_filter)
    if sort == "name_asc":
        query = query.order_by(Product.name.asc())
    elif sort == "oldest":
        query = query.order_by(Product.created_at.asc())
    else:
        query = query.order_by(Product.created_at.desc())
    total = (await db.execute(count_query)).scalar_one()
    rows = (await db.execute(query.offset((page - 1) * page_size).limit(page_size))).scalars().all()
    return rows, total


async def get_by_slug(db: AsyncSession, slug: str) -> Product:
    product = (await db.execute(select(Product).where(Product.slug == slug))).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


async def get_by_id(db: AsyncSession, product_id: UUID) -> Product:
    product = (await db.execute(select(Product).where(Product.id == product_id))).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


async def create_product(db: AsyncSession, payload: ProductCreate) -> Product:
    data = payload.model_dump()
    data["slug"] = await unique_slug(db, payload.name, payload.slug)
    data["short_description"] = data.get("short_description") or payload.name
    data["full_description"] = data.get("full_description") or data["short_description"]
    product = Product(**data)
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


async def update_product(db: AsyncSession, product_id: UUID, payload: ProductUpdate) -> Product:
    product = await get_by_id(db, product_id)
    data: dict[str, Any] = payload.model_dump(exclude_unset=True)
    if "name" in data or "slug" in data:
        data["slug"] = await unique_slug(db, data.get("name", product.name), data.get("slug", product.slug), product.id)
    if data.get("short_description") == "":
        data["short_description"] = data.get("name", product.name)
    if data.get("full_description") == "":
        data["full_description"] = data.get("short_description", product.short_description)
    for key, value in data.items():
        setattr(product, key, value)
    await db.commit()
    await db.refresh(product)
    return product


async def delete_product(db: AsyncSession, product_id: UUID) -> None:
    product = await get_by_id(db, product_id)
    await db.delete(product)
    await db.commit()
