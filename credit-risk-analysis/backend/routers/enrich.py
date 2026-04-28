"""
Enrichissement B2B — Mock + Groq AI Scraper
--------------------------------------------
POST /enrich/company/mock  → Deterministic mock DB (3 Tunisian companies)
POST /enrich/grok          → Real AI enrichment via Groq API (groq.com)
                             Model: llama3-8b-8192 (fastest, free tier)
"""

import os
import json
import re

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Load .env from the backend directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

router = APIRouter()

# ── Mock B2B Database ──────────────────────────────────────────────────────
MOCK_DB: dict = {
    "techtunisia": {
        "company_name": "TechTunisia SARL",
        "website": "techtunisia.tn",
        "employees": 42,
        "sector": "Technology / IT",
        "governorate": "Tunis",
        "description": "Développement de solutions digitales B2B pour les PMEs tunisiennes.",
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
        "description": "Exportation d'huile d'olive et de dattes biologiques certifiées.",
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
        "description": "Logistique et transport terrestre couvrant la Tunisie et le Maghreb.",
        "linkedin_followers": 4200,
        "founded_year": 2001,
        "rne_id": "9876543C",
    },
}


class EnrichRequest(BaseModel):
    company_name: str


# ── Mock endpoint ──────────────────────────────────────────────────────────
@router.post("/company/mock")
def enrich_company_mock(payload: EnrichRequest):
    """Mock B2B Enrichment — deterministic lookup."""
    key = payload.company_name.lower().replace(" ", "").replace("-", "").replace("_", "")

    matched = None
    for db_key, db_data in MOCK_DB.items():
        if db_key in key or key in db_key:
            matched = db_data
            break

    if matched:
        print(f"[ENRICH MOCK] Match: '{payload.company_name}' → {matched['company_name']}")
        return {"status": "success", "source": "mock_b2b_api", "data": matched}
    else:
        print(f"[ENRICH MOCK] No match for '{payload.company_name}'")
        return {
            "status": "partial",
            "source": "mock_b2b_api",
            "missing_fields": ["website", "employees", "sector", "description", "linkedin_followers"],
            "message": "Entreprise non trouvée dans la base mock. Saisie manuelle requise.",
        }


# ── Groq AI Enrichment endpoint ────────────────────────────────────────────
# Groq API is OpenAI-compatible but uses groq.com infrastructure
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"  # current recommended model (llama3-8b-8192 decommissioned)

SYSTEM_PROMPT = (
    "You are a financial data API. Return ONLY a valid JSON object. Generate highly realistic, UNIQUE data based specifically on the scale implied by the company name. "
    "Do not use default fallback numbers. Ensure logical consistency (e.g., expenses < turnover, cnss_workers <= total_workers). "
    "The JSON object MUST STRICTLY contain ONLY these exact numeric keys: "
    "\"business_turnover_tnd\", \"business_expenses_tnd\", \"nbr_of_workers\", \"workers_verified_cnss\", "
    "\"business_age_years\", \"compliance_rne_score\" (0-10), \"steg_sonede_score\" (0-10), "
    "\"banking_maturity_score\" (0-10), \"followers_fcb\", \"followers_insta\", \"followers_linkedin\", \"posts_per_month\"."
)

@router.post("/groq")
async def enrich_company_groq(payload: EnrichRequest):
    """
    AI-powered enrichment via Groq API (groq.com).
    Uses LLaMA 3.3 70B — fast inference.
    Reads GROQ_API_KEY from .env file.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("[GROQ] GROQ_API_KEY not set in .env")
        raise HTTPException(
            status_code=503,
            detail="Groq API key not configured. Set GROQ_API_KEY in backend/.env"
        )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    body = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Generate JSON for Tunisian company: {payload.company_name}"},
        ],
        "temperature": 0.8,
        "max_tokens": 512,
        "response_format": {"type": "json_object"}
    }

    print(f"[GROQ] Calling Groq API for company: '{payload.company_name}' | model: {GROQ_MODEL}")

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(GROQ_API_URL, headers=headers, json=body)
            response.raise_for_status()

        groq_data = response.json()
        raw_content = groq_data["choices"][0]["message"]["content"].strip()
        print(f"[GROQ] Raw response: {raw_content}")

        # Parse JSON — handle potential markdown code blocks
        try:
            extracted = json.loads(raw_content)
        except json.JSONDecodeError:
            match = re.search(r"\{.*?\}", raw_content, re.DOTALL)
            if match:
                extracted = json.loads(match.group())
            else:
                raise ValueError(f"Cannot parse JSON from: {raw_content}")

        result = {
            "business_turnover_tnd": extracted.get("business_turnover_tnd"),
            "business_expenses_tnd": extracted.get("business_expenses_tnd"),
            "nbr_of_workers": extracted.get("nbr_of_workers"),
            "workers_verified_cnss": extracted.get("workers_verified_cnss"),
            "business_age_years": extracted.get("business_age_years"),
            "compliance_rne_score": extracted.get("compliance_rne_score"),
            "steg_sonede_score": extracted.get("steg_sonede_score"),
            "banking_maturity_score": extracted.get("banking_maturity_score"),
            "followers_fcb": extracted.get("followers_fcb"),
            "followers_insta": extracted.get("followers_insta"),
            "followers_linkedin": extracted.get("followers_linkedin"),
            "posts_per_month": extracted.get("posts_per_month"),
        }

        print(f"[GROQ] Extracted: {result}")

        return {
            "status": "success",
            "source": "groq",
            "company_name": payload.company_name,
            "data": result,
        }

    except httpx.HTTPStatusError as e:
        print(f"[GROQ ERROR] HTTP {e.response.status_code}: {e.response.text[:300]}")
        raise HTTPException(
            status_code=502,
            detail=f"Groq API error {e.response.status_code}: {e.response.text[:200]}"
        )
    except Exception as e:
        print(f"[GROQ ERROR] {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Enrichissement Groq échoué: {str(e)}"
        )
