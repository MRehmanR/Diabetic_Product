from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class QuoteRequestCreate(BaseModel):
    product_id: UUID | None = None
    full_name: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    product_name: str | None = None
    brand_model: str | None = None
    quantity: int = Field(default=1, ge=1)
    expiration_date: date | None = None
    box_condition: str | None = None
    front_image_url: str | None = None
    back_image_url: str | None = None
    notes: str | None = None
    image_urls: list[str] = Field(default_factory=list)
    name: str | None = None
    supply_id: UUID | None = None
    supply_type: str | None = None
    condition_description: str | None = None


class QuoteRequestUpdate(BaseModel):
    status: str | None = None
    admin_notes: str | None = None
    notes: str | None = None
    quoted_amount: Decimal | None = None


class QuoteRequestRead(BaseModel):
    id: UUID
    product_id: UUID | None
    full_name: str
    phone: str | None
    email: EmailStr | None
    product_name: str
    brand_model: str | None
    quantity: int
    expiration_date: date | None
    box_condition: str | None
    front_image_url: str | None
    back_image_url: str | None
    image_urls: list[str]
    notes: str | None
    status: str
    admin_notes: str | None
    quoted_amount: Decimal | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OfferRead(QuoteRequestRead):
    supply_id: UUID | None = None
    name: str
    supply_type: str
    condition_description: str | None


class PaginatedQuoteRequests(BaseModel):
    items: list[QuoteRequestRead]
    total: int
    page: int
    page_size: int
