from uuid import UUID

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import require_admin
from app.database.database import get_db
from app.models.user import User
from app.schemas.brand import BrandCreate, BrandRead, BrandUpdate
from app.services import brand_service

router = APIRouter(tags=["brands"])


@router.get("/brands", response_model=list[BrandRead])
async def list_public_brands(response: Response, db: AsyncSession = Depends(get_db)):
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
    return await brand_service.list_brands(db, active_only=True)


@router.get("/admin/brands", response_model=list[BrandRead])
async def list_admin_brands(db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await brand_service.list_brands(db, active_only=False)


@router.post("/admin/brands", response_model=BrandRead, status_code=201)
async def create_admin_brand(
    payload: BrandCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    return await brand_service.create_brand(db, payload)


@router.put("/admin/brands/{brand_id}", response_model=BrandRead)
async def update_admin_brand(
    brand_id: UUID,
    payload: BrandUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    return await brand_service.update_brand(db, brand_id, payload)


@router.delete("/admin/brands/{brand_id}", status_code=204)
async def delete_admin_brand(
    brand_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    await brand_service.delete_brand(db, brand_id)
