import asyncio

from sqlalchemy import select

from app.core.config import settings
from app.core.security import get_password_hash
from app.database.database import AsyncSessionLocal
from app.models.user import User


async def main() -> None:
    async with AsyncSessionLocal() as db:
        admin = (await db.execute(select(User).where(User.email == settings.SEED_ADMIN_EMAIL.lower()))).scalar_one_or_none()
        if not admin:
            db.add(User(email=settings.SEED_ADMIN_EMAIL.lower(), password_hash=get_password_hash(settings.SEED_ADMIN_PASSWORD), role="admin"))

        await db.commit()
        print(f"Admin seed complete: {settings.SEED_ADMIN_EMAIL}")


if __name__ == "__main__":
    asyncio.run(main())
