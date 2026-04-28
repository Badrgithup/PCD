"""
FinScore PME — FastAPI Backend
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Fintech SaaS platform connecting Tunisian SMEs with investors
using alternative credit scoring powered by dual-model stacking ML.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.database import Base, engine
from ml_services.predictor import model_loader
# Import ALL routers at top (clean architecture)
from routers import auth, marketplace, scoring, enrich, wishlist, chat


# ---------------------------------------------------------------------------
# Lifespan: startup / shutdown hooks
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables and preload ML models on startup."""
    Base.metadata.create_all(bind=engine)
    model_loader.load()
    yield


# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="FinScore PME API",
    description=(
        "Alternative credit scoring API for Tunisian SMEs. "
        "Dual-model stacking (Gradient Boosting + Random Forest → "
        "Logistic Regression meta-model) with SHAP explainability."
    ),
    version="1.0.0",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(scoring.router, prefix="/scoring", tags=["Scoring"])
app.include_router(marketplace.router, prefix="/marketplace", tags=["Marketplace"])
app.include_router(enrich.router, prefix="/enrich", tags=["Enrichment"])
app.include_router(wishlist.router, prefix="/wishlist", tags=["Wishlist"])
app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "FinScore PME API",
        "version": "1.0.0",
        "ml_models_loaded": model_loader.is_loaded,
    }