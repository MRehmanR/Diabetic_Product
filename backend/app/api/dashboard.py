from sqlalchemy import extract, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends

from app.core.dependencies import require_admin
from app.database.database import get_db
from app.models.product import Product
from app.models.quote_request import QuoteRequest
from app.models.user import User

router = APIRouter(prefix="/admin/dashboard", tags=["dashboard"])


@router.get("")
async def dashboard(db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    total_products = (await db.execute(select(func.count()).select_from(Product))).scalar_one()
    total_requests = (await db.execute(select(func.count()).select_from(QuoteRequest))).scalar_one()
    pending = (await db.execute(select(func.count()).select_from(QuoteRequest).where(QuoteRequest.status == "pending"))).scalar_one()
    approved = (await db.execute(select(func.count()).select_from(QuoteRequest).where(QuoteRequest.status == "approved"))).scalar_one()
    rejected = (await db.execute(select(func.count()).select_from(QuoteRequest).where(QuoteRequest.status == "rejected"))).scalar_one()
    monthly_rows = (
        await db.execute(
            select(extract("year", QuoteRequest.created_at), extract("month", QuoteRequest.created_at), func.count())
            .group_by(extract("year", QuoteRequest.created_at), extract("month", QuoteRequest.created_at))
            .order_by(extract("year", QuoteRequest.created_at), extract("month", QuoteRequest.created_at))
        )
    ).all()
    return {
        "total_products": total_products,
        "total_quote_requests": total_requests,
        "pending_requests": pending,
        "approved_requests": approved,
        "rejected_requests": rejected,
        "monthly_quote_requests": [
            {"year": int(year), "month": int(month), "count": count} for year, month, count in monthly_rows
        ],
    }
