"""
Scoring router: predict and what-if simulation endpoints.
"""

import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from ml_services.predictor import model_loader
from models.orm import FinancialData, PMEProfile, ScoreReport, User, UserRole
from schemas.scoring import FinancialInput, ScoreResponse

router = APIRouter()


def _features_dict(payload: FinancialInput) -> dict:
    """Convert Pydantic input into the dict format expected by the ML predictor."""
    return payload.model_dump(exclude_none=False)


@router.post("/predict", response_model=ScoreResponse, status_code=status.HTTP_201_CREATED)
def predict_score(
    payload: FinancialInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run credit scoring on submitted financial data.
    Saves the FinancialData and ScoreReport to the database.
    Requires authentication (PME role).
    """
    # Verify PME role
    if current_user.role != UserRole.PME:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only PME users can submit scoring requests",
        )

    # Get PME profile
    profile = db.query(PMEProfile).filter(PMEProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PME profile not found. Please complete registration.",
        )

    # Run ML prediction
    if not model_loader.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML models are not loaded. Please try again later.",
        )

    features = _features_dict(payload)
    result = model_loader.predict(features)

    # Save FinancialData
    fin_data = FinancialData(
        pme_profile_id=profile.id,
        business_turnover_tnd=payload.business_turnover_tnd,
        business_expenses_tnd=payload.business_expenses_tnd,
        profit_margin=payload.profit_margin,
        nbr_of_workers=payload.nbr_of_workers,
        workers_verified_cnss=payload.workers_verified_cnss,
        formal_worker_ratio=payload.formal_worker_ratio,
        business_age_years=payload.business_age_years,
        number_of_owners=payload.number_of_owners,
        compliance_rne_score=payload.compliance_rne_score,
        steg_sonede_score=payload.steg_sonede_score,
        banking_maturity_score=payload.banking_maturity_score,
        followers_fcb=payload.followers_fcb,
        followers_insta=payload.followers_insta,
        followers_linkedin=payload.followers_linkedin,
        posts_per_month=payload.posts_per_month,
        type_of_business=payload.type_of_business,
    )
    db.add(fin_data)
    db.flush()

    # Save ScoreReport
    report = ScoreReport(
        financial_data_id=fin_data.id,
        pme_profile_id=profile.id,
        fin_score=result["score"],
        risk_tier=result["risk_tier"],
        decision=result["decision"],
        decision_explanation=result["decision_explanation"],
        shap_explanations_json=json.dumps(result["shap_explanations"], default=str),
        model1_probability=result["probabilities"]["model1_financial"],
        model2_probability=result["probabilities"]["model2_behavioral"],
        stacked_probability=result["probabilities"]["stacked_final"],
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return ScoreResponse(
        score=result["score"],
        risk_tier=result["risk_tier"],
        decision=result["decision"],
        decision_explanation=result["decision_explanation"],
        probabilities=result["probabilities"],
        strengths=result["strengths"],
        weaknesses=result["weaknesses"],
        is_simulation=False,
        report_id=str(report.id),
    )


@router.post("/what-if", response_model=ScoreResponse)
def what_if_simulation(
    payload: FinancialInput,
    current_user: User = Depends(get_current_user),
):
    """
    Run a hypothetical what-if scoring simulation.
    Returns the predicted score WITHOUT saving anything to the database.
    Available to both PME and BANK users.
    """
    if not model_loader.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML models are not loaded. Please try again later.",
        )

    features = _features_dict(payload)
    result = model_loader.predict(features)

    return ScoreResponse(
        score=result["score"],
        risk_tier=result["risk_tier"],
        decision=result["decision"],
        decision_explanation=result["decision_explanation"],
        probabilities=result["probabilities"],
        strengths=result["strengths"],
        weaknesses=result["weaknesses"],
        is_simulation=True,
        report_id=None,
    )
