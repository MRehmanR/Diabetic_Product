from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    slug: str | None = None
    category: str = Field(min_length=2, max_length=120)
    short_description: str = Field(min_length=2)
    full_description: str = Field(min_length=2)
    accepted_models: list[str] = Field(default_factory=list)
    requirements: list[str] = Field(default_factory=list)
    image_url: str | None = None
    status: str = "active"
    payout_min: Decimal | None = None
    payout_max: Decimal | None = None
    features: list[str] = Field(default_factory=list)
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    category: str | None = None
    short_description: str | None = None
    full_description: str | None = None
    accepted_models: list[str] | None = None
    requirements: list[str] | None = None
    image_url: str | None = None
    status: str | None = None
    payout_min: Decimal | None = None
    payout_max: Decimal | None = None
    features: list[str] | None = None
    is_active: bool | None = None


class ProductRead(ProductBase):
    id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SupplyRead(ProductRead):
    models: list[str] = Field(default_factory=list)


class PaginatedProducts(BaseModel):
    items: list[ProductRead]
    total: int
    page: int
    page_size: int
