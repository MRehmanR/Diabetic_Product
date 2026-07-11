from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.quote_request import QuoteRequest
from app.schemas.quote_request import QuoteRequestCreate, QuoteRequestUpdate

FRONTEND_STATUS_TO_API = {"quoted": "approved", "accepted": "approved", "declined": "rejected"}
API_STATUS_TO_FRONTEND = {"approved": "quoted", "rejected": "declined"}


def normalize_status(status: str | None) -> str | None:
    if status is None:
        return None
    return FRONTEND_STATUS_TO_API.get(status, status)


def denormalize_status(status: str) -> str:
    return API_STATUS_TO_FRONTEND.get(status, status)


async def create_quote_request(db: AsyncSession, payload: QuoteRequestCreate) -> QuoteRequest:
    full_name = payload.full_name or payload.name
    product_name = payload.product_name or payload.supply_type
    if not full_name or not product_name:
        raise HTTPException(status_code=422, detail="full_name/name and product_name/supply_type are required")
    quote = QuoteRequest(
        product_id=payload.product_id or payload.supply_id,
        full_name=full_name,
        phone=payload.phone,
        email=str(payload.email).lower() if payload.email else None,
        product_name=product_name,
        brand_model=payload.brand_model,
        quantity=payload.quantity,
        expiration_date=payload.expiration_date,
        box_condition=payload.box_condition or payload.condition_description,
        front_image_url=payload.front_image_url,
        back_image_url=payload.back_image_url,
        image_urls=payload.image_urls,
        notes=payload.notes,
        status="pending",
    )
    db.add(quote)
    await db.commit()
    await db.refresh(quote)
    return quote


async def list_quote_requests(db: AsyncSession, page: int, page_size: int, search: str | None, status_filter: str | None):
    query = select(QuoteRequest)
    count_query = select(func.count()).select_from(QuoteRequest)
    if search:
        pattern = f"%{search}%"
        condition = or_(QuoteRequest.full_name.ilike(pattern), QuoteRequest.email.ilike(pattern), QuoteRequest.product_name.ilike(pattern))
        query = query.where(condition)
        count_query = count_query.where(condition)
    if status_filter:
        query = query.where(QuoteRequest.status == normalize_status(status_filter))
        count_query = count_query.where(QuoteRequest.status == normalize_status(status_filter))
    total = (await db.execute(count_query)).scalar_one()
    rows = (await db.execute(query.order_by(QuoteRequest.created_at.desc()).offset((page - 1) * page_size).limit(page_size))).scalars().all()
    return rows, total


async def get_quote_request(db: AsyncSession, quote_id: UUID) -> QuoteRequest:
    quote = (await db.execute(select(QuoteRequest).where(QuoteRequest.id == quote_id))).scalar_one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote request not found")
    return quote


async def update_quote_request(db: AsyncSession, quote_id: UUID, payload: QuoteRequestUpdate) -> QuoteRequest:
    quote = await get_quote_request(db, quote_id)
    data = payload.model_dump(exclude_unset=True)
    if "status" in data:
        data["status"] = normalize_status(data["status"])
    for key, value in data.items():
        setattr(quote, key, value)
    await db.commit()
    await db.refresh(quote)
    return quote


async def delete_quote_request(db: AsyncSession, quote_id: UUID) -> None:
    quote = await get_quote_request(db, quote_id)
    await db.delete(quote)
    await db.commit()


def offer_dict(quote: QuoteRequest) -> dict:
    return {
        "id": str(quote.id),
        "supply_id": str(quote.product_id) if quote.product_id else None,
        "name": quote.full_name,
        "email": quote.email,
        "phone": quote.phone,
        "supply_type": quote.product_name,
        "quantity": quote.quantity,
        "condition_description": quote.box_condition,
        "expiration_date": quote.expiration_date.isoformat() if quote.expiration_date else None,
        "image_urls": quote.image_urls or [],
        "status": denormalize_status(quote.status),
        "quoted_amount": float(quote.quoted_amount) if quote.quoted_amount is not None else None,
        "notes": quote.notes,
        "created_at": quote.created_at.isoformat(),
        "updated_at": quote.updated_at.isoformat(),
    }
