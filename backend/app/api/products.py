from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import require_admin
from app.database.database import get_db
from app.models.user import User
from app.schemas.product import PaginatedProducts, ProductCreate, ProductRead, ProductUpdate
from app.services import product_service

router = APIRouter(tags=["products"])


def product_to_supply(product) -> dict:
    return {
        "id": str(product.id),
        "name": product.name,
        "slug": product.slug,
        "brand": product.brand,
        "serial_number": product.serial_number,
        "short_description": product.short_description,
        "full_description": product.full_description,
        "category": product.category,
        "requirements": product.requirements or [],
        "models": product.accepted_models or [],
        "accepted_models": product.accepted_models or [],
        "image_url": product.image_url,
        "features": product.features or [],
        "is_active": product.is_active,
        "status": product.status,
        "created_at": product.created_at.isoformat(),
        "updated_at": product.updated_at.isoformat(),
    }


@router.get("/products", response_model=PaginatedProducts)
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    search: str | None = None,
    category: str | None = None,
    status: str | None = None,
    sort: str = "newest",
    db: AsyncSession = Depends(get_db),
):
    rows, total = await product_service.list_products(db, page, page_size, search, category, status, sort)
    return {"items": rows, "total": total, "page": page, "page_size": page_size}


@router.get("/products/{slug}", response_model=ProductRead)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    return await product_service.get_by_slug(db, slug)


@router.get("/supplies")
async def list_supplies(
    response: Response,
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=100),
    search: str | None = None,
    category: str | None = None,
    status: str | None = None,
    sort: str = "newest",
    db: AsyncSession = Depends(get_db),
):
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
    rows, _ = await product_service.list_products(db, page, page_size, search, category, status, sort)
    return [product_to_supply(row) for row in rows]


@router.get("/supplies/{slug}")
async def get_supply(slug: str, response: Response, db: AsyncSession = Depends(get_db)):
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
    return product_to_supply(await product_service.get_by_slug(db, slug))


@router.post("/admin/products", response_model=ProductRead, status_code=201)
async def create_product(payload: ProductCreate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await product_service.create_product(db, payload)


@router.put("/admin/products/{product_id}", response_model=ProductRead)
async def update_product(product_id: UUID, payload: ProductUpdate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await product_service.update_product(db, product_id, payload)


@router.delete("/admin/products/{product_id}", status_code=204)
async def delete_product(product_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    await product_service.delete_product(db, product_id)


@router.post("/admin/supplies", status_code=201)
async def create_supply(payload: dict, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    if "models" in payload:
        payload["accepted_models"] = payload.pop("models")
    product = await product_service.create_product(db, ProductCreate(**payload))
    return product_to_supply(product)


@router.put("/admin/supplies/{product_id}")
async def update_supply(product_id: UUID, payload: dict, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    if "models" in payload:
        payload["accepted_models"] = payload.pop("models")
    product = await product_service.update_product(db, product_id, ProductUpdate(**payload))
    return product_to_supply(product)


@router.delete("/admin/supplies/{product_id}", status_code=204)
async def delete_supply(product_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    await product_service.delete_product(db, product_id)
