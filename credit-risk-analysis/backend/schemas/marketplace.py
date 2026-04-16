"""
Pydantic schemas for the marketplace endpoint (/marketplace/browse).
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class MarketplaceListing(BaseModel):
    """A single PME profile visible on the investor marketplace."""
    company_name: str
    sector: str | None = None
    rne_code: str | None = None
    latest_fin_score: int | None = Field(default=None, description="Most recent FinScore (0-100)")
    latest_risk_tier: str | None = Field(default=None, description="Most recent risk tier")
    profile_id: str


class MarketplaceBrowseResponse(BaseModel):
    """Response for GET /marketplace/browse."""
    total: int
    listings: list[MarketplaceListing]
