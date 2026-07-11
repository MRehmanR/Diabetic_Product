from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    role: str
    is_active: bool

    model_config = {"from_attributes": True}


class AdminCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=16)
    password: str = Field(min_length=6)


class PasswordResetMessage(BaseModel):
    message: str
    reset_url: str | None = None
