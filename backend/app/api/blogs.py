from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import require_admin
from app.database.database import get_db
from app.models.user import User
from app.schemas.blog import BlogCreate, BlogRead, BlogUpdate
from app.services import blog_service

router = APIRouter(tags=["blogs"])


@router.get("/blogs", response_model=list[BlogRead])
async def list_blogs(search: str | None = None, db: AsyncSession = Depends(get_db)):
    return await blog_service.list_blogs(db, search=search, published_only=True)


@router.get("/blogs/{slug}", response_model=BlogRead)
async def get_blog(slug: str, db: AsyncSession = Depends(get_db)):
    return await blog_service.get_by_slug(db, slug, published_only=True)


@router.get("/admin/blogs", response_model=list[BlogRead])
async def list_admin_blogs(search: str | None = None, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await blog_service.list_blogs(db, search=search, published_only=False)


@router.post("/admin/blogs", response_model=BlogRead, status_code=201)
async def create_admin_blog(payload: BlogCreate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await blog_service.create_blog(db, payload)


@router.put("/admin/blogs/{post_id}", response_model=BlogRead)
async def update_admin_blog(post_id: UUID, payload: BlogUpdate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await blog_service.update_blog(db, post_id, payload)


@router.delete("/admin/blogs/{post_id}", status_code=204)
async def delete_admin_blog(post_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    await blog_service.delete_blog(db, post_id)
