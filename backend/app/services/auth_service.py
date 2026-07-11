import hashlib
import secrets
import smtplib
from datetime import UTC, datetime, timedelta
from email.message import EmailMessage

from fastapi import HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_token, get_password_hash, verify_password
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User

PASSWORD_RESET_SENT_MESSAGE = "If that email exists, a password reset link has been sent."
PASSWORD_RESET_DONE_MESSAGE = "Password has been reset."


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
    result = await db.execute(select(User).where(User.email == email.lower()))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")
    return user


def build_tokens(user: User) -> dict[str, str]:
    subject = str(user.id)
    return {
        "access_token": create_token(subject, "access", timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)),
        "refresh_token": create_token(subject, "refresh", timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)),
        "token_type": "bearer",
    }


async def create_admin(db: AsyncSession, email: str, password: str) -> User:
    existing_admin = (await db.execute(select(User).where(User.role == "admin").limit(1))).scalar_one_or_none()
    if existing_admin:
        raise HTTPException(status_code=409, detail="Admin setup is already complete")
    user = User(email=email.lower(), password_hash=get_password_hash(password), role="admin")
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def build_password_reset_url(token: str) -> str:
    return f"{settings.FRONTEND_URL.rstrip('/')}/admin/reset-password?token={token}"


def send_password_reset_email(email: str, reset_url: str) -> bool:
    if not settings.SMTP_HOST:
        return False

    message = EmailMessage()
    message["Subject"] = "Reset your admin password"
    message["From"] = settings.SMTP_FROM_EMAIL
    message["To"] = email
    message.set_content(
        "Use the link below to reset your admin password.\n\n"
        f"{reset_url}\n\n"
        f"This link expires in {settings.PASSWORD_RESET_EXPIRE_MINUTES} minutes."
    )

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as smtp:
        if settings.SMTP_USE_TLS:
            smtp.starttls()
        if settings.SMTP_USERNAME:
            smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        smtp.send_message(message)

    return True


async def request_password_reset(db: AsyncSession, email: str) -> dict[str, str | None]:
    normalized_email = email.lower()
    user = (await db.execute(select(User).where(User.email == normalized_email, User.is_active.is_(True)))).scalar_one_or_none()
    if not user:
        return {"message": PASSWORD_RESET_SENT_MESSAGE, "reset_url": None}

    now = datetime.now(UTC)
    await db.execute(
        update(PasswordResetToken)
        .where(PasswordResetToken.user_id == user.id, PasswordResetToken.used_at.is_(None))
        .values(used_at=now)
    )

    token = secrets.token_urlsafe(32)
    reset_url = build_password_reset_url(token)
    db.add(
        PasswordResetToken(
            user_id=user.id,
            token_hash=hash_reset_token(token),
            expires_at=now + timedelta(minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES),
        )
    )
    await db.commit()

    sent = send_password_reset_email(user.email, reset_url)
    visible_url = reset_url if settings.ENVIRONMENT == "development" and not sent else None
    return {"message": PASSWORD_RESET_SENT_MESSAGE, "reset_url": visible_url}


async def reset_password(db: AsyncSession, token: str, password: str) -> dict[str, str]:
    token_row = (
        await db.execute(select(PasswordResetToken).where(PasswordResetToken.token_hash == hash_reset_token(token)))
    ).scalar_one_or_none()
    now = datetime.now(UTC)
    expires_at = token_row.expires_at if token_row else now
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    if not token_row or token_row.used_at is not None or expires_at < now:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired password reset link")

    user = (await db.execute(select(User).where(User.id == token_row.user_id, User.is_active.is_(True)))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired password reset link")

    user.password_hash = get_password_hash(password)
    token_row.used_at = now
    await db.commit()
    return {"message": PASSWORD_RESET_DONE_MESSAGE}
