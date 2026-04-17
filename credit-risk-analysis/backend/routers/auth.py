"""
Authentication router: register and login endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import create_access_token, hash_password, verify_password
from models.orm import PMEProfile, User, UserRole
from schemas.auth import TokenResponse, UserLogin, UserRegister

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    """Register a new user. Creates a PME profile automatically if role is PME."""

    # Check for existing email
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create user
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=UserRole(payload.role),
    )
    db.add(user)
    db.flush()  # Get user.id before creating profile

    # Auto-create PME profile for PME users
    if user.role == UserRole.PME:
        profile = PMEProfile(
            user_id=user.id,
            company_name=payload.company_name or payload.email.split("@")[0],
            identifiant_unique_rne=payload.identifiant_unique_rne,
            sector=payload.sector,
            governorate=payload.governorate,
            visibility_status="Private",
            marketplace_status=0
        )
        db.add(profile)

    db.commit()
    db.refresh(user)

    # Generate JWT
    token = create_access_token(data={"sub": user.email, "role": user.role.value})

    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        email=user.email,
        role=user.role.value,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return a JWT access token."""

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(data={"sub": user.email, "role": user.role.value})

    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        email=user.email,
        role=user.role.value,
    )
