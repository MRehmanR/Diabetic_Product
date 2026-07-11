from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, require_admin
from app.core.security import decode_token
from app.database.database import get_db
from app.models.user import User
from app.schemas.auth import (
    AdminCreate,
    ForgotPasswordRequest,
    LoginRequest,
    PasswordResetMessage,
    RefreshRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserRead,
)
from app.services.auth_service import authenticate_user, build_tokens, create_admin, request_password_reset, reset_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, str(payload.email), payload.password)
    return build_tokens(user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest, db: AsyncSession = Depends(get_db)):
    decoded = decode_token(payload.refresh_token)
    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    try:
        user_id = UUID(str(decoded.get("sub")))
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    return build_tokens(user)


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/setup", response_model=UserRead, status_code=201)
async def setup_admin(payload: AdminCreate, db: AsyncSession = Depends(get_db)):
    return await create_admin(db, str(payload.email), payload.password)


@router.post("/forgot-password", response_model=PasswordResetMessage)
async def forgot_password(payload: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    return await request_password_reset(db, str(payload.email))


@router.post("/reset-password", response_model=PasswordResetMessage)
async def reset_admin_password(payload: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    return await reset_password(db, payload.token, payload.password)


@router.get("/admin-check", response_model=UserRead)
async def admin_check(current_user: User = Depends(require_admin)):
    return current_user
