from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import require_admin
from app.database.database import get_db
from app.models.user import User
from app.schemas.quote_request import PaginatedQuoteRequests, QuoteRequestCreate, QuoteRequestRead, QuoteRequestUpdate
from app.services import quote_service

router = APIRouter(tags=["quote requests"])


@router.post("/quote-requests", response_model=QuoteRequestRead, status_code=201)
async def create_quote_request(payload: QuoteRequestCreate, db: AsyncSession = Depends(get_db)):
    return await quote_service.create_quote_request(db, payload)


@router.post("/offers", status_code=201)
async def create_offer(payload: QuoteRequestCreate, db: AsyncSession = Depends(get_db)):
    quote = await quote_service.create_quote_request(db, payload)
    return quote_service.offer_dict(quote)


@router.get("/admin/quote-requests", response_model=PaginatedQuoteRequests)
async def list_quote_requests(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    rows, total = await quote_service.list_quote_requests(db, page, page_size, search, status)
    return {"items": rows, "total": total, "page": page, "page_size": page_size}


@router.get("/admin/offers")
async def list_offers(
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=100),
    search: str | None = None,
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    rows, _ = await quote_service.list_quote_requests(db, page, page_size, search, status)
    return [quote_service.offer_dict(row) for row in rows]


@router.get("/admin/quote-requests/{quote_id}", response_model=QuoteRequestRead)
async def get_quote_request(quote_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await quote_service.get_quote_request(db, quote_id)


@router.put("/admin/quote-requests/{quote_id}", response_model=QuoteRequestRead)
async def update_quote_request(quote_id: UUID, payload: QuoteRequestUpdate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await quote_service.update_quote_request(db, quote_id, payload)


@router.put("/admin/offers/{quote_id}")
async def update_offer(quote_id: UUID, payload: QuoteRequestUpdate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    quote = await quote_service.update_quote_request(db, quote_id, payload)
    return quote_service.offer_dict(quote)


@router.delete("/admin/quote-requests/{quote_id}", status_code=204)
async def delete_quote_request(quote_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    await quote_service.delete_quote_request(db, quote_id)


@router.delete("/admin/offers/{quote_id}", status_code=204)
async def delete_offer(quote_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    await quote_service.delete_quote_request(db, quote_id)
