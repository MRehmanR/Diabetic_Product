from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class BlogBase(BaseModel):
    title: str = Field(min_length=2, max_length=255)
    slug: str | None = None
    excerpt: str = ""
    content: str = Field(min_length=10)
    image_url: str | None = None
    author: str = "Diabetics King"
    status: str = "published"
    is_published: bool = True


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    image_url: str | None = None
    author: str | None = None
    status: str | None = None
    is_published: bool | None = None


class BlogRead(BlogBase):
    id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
