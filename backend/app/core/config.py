from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Diabaticking API"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    BACKEND_CORS_ORIGINS: str | list[str] = ["http://localhost:3000"]
    BACKEND_CORS_ORIGIN_REGEX: str | None = None
    UPLOAD_DIR: str = "app/uploads"
    PUBLIC_UPLOAD_BASE_URL: str = "http://localhost:8000/uploads"
    MAX_UPLOAD_SIZE_MB: int = 5
    SEED_ADMIN_EMAIL: str = "admin@diabcare.com"
    SEED_ADMIN_PASSWORD: str = "admin123"
    FRONTEND_URL: str = "http://127.0.0.1:5173"
    PASSWORD_RESET_EXPIRE_MINUTES: int = 30
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "no-reply@diabaticking.com"
    SMTP_USE_TLS: bool = True

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    @field_validator("BACKEND_CORS_ORIGINS", mode="after")
    @classmethod
    def parse_cors(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
