from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import uuid

from core.database import get_db
from core.security import get_current_user
from models.orm import User, PMEProfile, Wishlist

router = APIRouter()

@router.post("/{profile_id}")
def toggle_wishlist(
    profile_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """TASK 4: Add or remove a PME profile from the user's wishlist."""
    # Ensure profile exists
    try:
        profile_uuid = uuid.UUID(profile_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid profile ID format")
        
    profile = db.query(PMEProfile).filter(PMEProfile.id == profile_uuid).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Check if already in wishlist
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.pme_profile_id == profile.id
    ).first()

    try:
        if existing:
            # Remove from wishlist
            db.delete(existing)
            action = "removed"
        else:
            # Add to wishlist
            new_wishlist = Wishlist(
                user_id=current_user.id,
                pme_profile_id=profile.id
            )
            db.add(new_wishlist)
            action = "added"
            
        db.commit()
        return {"status": "success", "action": action, "profile_id": str(profile.id)}
    except Exception as e:
        db.rollback()
        print(f"[WISHLIST ERROR] DB write failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while updating wishlist."
        )

@router.get("/")
def get_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all wishlisted PME profiles for the current user."""
    wishlists = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).all()
    wishlisted_ids = [str(w.pme_profile_id) for w in wishlists]
    return {"status": "success", "wishlisted_profile_ids": wishlisted_ids}
