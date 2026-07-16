from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class BrandBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    slug: str | None = None
    image_url: str | None = None
    description: str = ""
    display_order: int = 0
    is_active: bool = True


class BrandCreate(BrandBase):
    pass


class BrandUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    slug: str | None = None
    image_url: str | None = None
    description: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


class BrandRead(BrandBase):
    id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
