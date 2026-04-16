"""
Pydantic schemas for authentication endpoints.
"""

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    """POST /auth/register request body."""
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    role: str = Field(default="PME", pattern="^(PME|BANK)$")  # PME or BANK
    company_name: str | None = Field(default=None, max_length=255)
    rne_code: str | None = Field(default=None, max_length=50)
    sector: str | None = Field(default=None, max_length=100)


class UserLogin(BaseModel):
    """POST /auth/login request body."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Login / Register response with JWT."""
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    role: str


class UserResponse(BaseModel):
    """Public user representation."""
    id: str
    email: str
    role: str

    model_config = {"from_attributes": True}
