"""
Marketplace router: browse public PME profiles with their latest scores.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from core.database import get_db
from models.orm import PMEProfile, ScoreReport
from schemas.marketplace import MarketplaceBrowseResponse, MarketplaceListing

router = APIRouter()


@router.get("/browse", response_model=MarketplaceBrowseResponse)
def browse_marketplace(
    skip: int = Query(default=0, ge=0, description="Pagination offset"),
    limit: int = Query(default=20, ge=1, le=100, description="Page size"),
    sector: str | None = Query(default=None, description="Filter by sector"),
    db: Session = Depends(get_db),
):
    """
    Browse PME profiles that are publicly listed on the marketplace.
    Returns company info along with their latest FinScore.
    Available to all users (investors / banks).
    """
    query = db.query(PMEProfile).filter(PMEProfile.is_public_for_marketplace == True)  # noqa: E712

    if sector:
        query = query.filter(PMEProfile.sector == sector)

    total = query.count()
    profiles = query.offset(skip).limit(limit).all()

    listings = []
    for profile in profiles:
        # Get the latest score report for this profile
        latest_report = (
            db.query(ScoreReport)
            .filter(ScoreReport.pme_profile_id == profile.id)
            .order_by(ScoreReport.created_at.desc())
            .first()
        )

        listings.append(
            MarketplaceListing(
                company_name=profile.company_name,
                sector=profile.sector,
                rne_code=profile.rne_code,
                latest_fin_score=latest_report.fin_score if latest_report else None,
                latest_risk_tier=latest_report.risk_tier if latest_report else None,
                profile_id=str(profile.id),
            )
        )

    return MarketplaceBrowseResponse(total=total, listings=listings)
