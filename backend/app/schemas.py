from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    """Request body schema for creating a user."""

    name: str = Field(..., min_length=1, max_length=100, examples=["Vimal"])
    age: int = Field(..., ge=1, le=120, examples=[25])
    mobile: str = Field(..., pattern=r"^[0-9]{10}$", examples=["9876543210"])


class UserResponse(BaseModel):
    """Response schema returned to the client."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    age: int
    mobile: str
    created_at: datetime
