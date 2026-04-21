"""
Enrichissement B2B Mock Service
---------------------------------
Simule une API d'enrichissement d'entreprise type Clearbit/Pappers
pour le contexte tunisien (Zéro Budget PCD).
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# ---------------------------------------------------------------------------
# Mock B2B Database (3 fausses entreprises tunisiennes)
# ---------------------------------------------------------------------------
MOCK_DB: dict = {
    "techtunisia": {
        "company_name": "TechTunisia SARL",
        "website": "techtunisia.tn",
        "employees": 42,
        "sector": "Technology / IT",
        "governorate": "Tunis",
        "description": "Entreprise spécialisée dans le développement de solutions digitales B2B pour les PME tunisiennes.",
        "linkedin_followers": 1800,
        "founded_year": 2015,
        "rne_id": "1234567A",
    },
    "agrisfax": {
        "company_name": "AgriSfax Export",
        "website": "agrisfax.com.tn",
        "employees": 87,
        "sector": "Agriculture",
        "governorate": "Sfax",
        "description": "Leader régional dans l'exportation d'huile d'olive et de dattes biologiques certifiées.",
        "linkedin_followers": 650,
        "founded_year": 2009,
        "rne_id": "7654321B",
    },
    "carthagelogistics": {
        "company_name": "Carthage Logistics Group",
        "website": "carthagelogistics.tn",
        "employees": 210,
        "sector": "Transport / Logistics",
        "governorate": "Ariana",
        "description": "Groupe de logistique et transport terrestre couvrant toute la Tunisie et le Maghreb.",
        "linkedin_followers": 4200,
        "founded_year": 2001,
        "rne_id": "9876543C",
    },
}

# ---------------------------------------------------------------------------
# Schema
# ---------------------------------------------------------------------------
class EnrichRequest(BaseModel):
    company_name: str


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------
@router.post("/company/mock")
def enrich_company_mock(payload: EnrichRequest):
    """
    Mock B2B Enrichment API.
    - Si le nom correspond à une entrée connue → renvoie les données complètes.
    - Sinon → renvoie les champs manquants pour forcer la saisie manuelle.
    """
    # Normalize: minuscules, sans espaces
    key = payload.company_name.lower().replace(" ", "").replace("-", "").replace("_", "")

    # Recherche approximative (contient le nom)
    matched = None
    for db_key, db_data in MOCK_DB.items():
        if db_key in key or key in db_key:
            matched = db_data
            break

    if matched:
        return {
            "status": "success",
            "source": "mock_b2b_api",
            "data": matched,
        }
    else:
        return {
            "status": "partial",
            "source": "mock_b2b_api",
            "missing_fields": ["website", "employees", "sector", "description", "linkedin_followers", "founded_year"],
            "message": "Entreprise non trouvée dans la base mock. Saisie manuelle requise.",
        }
