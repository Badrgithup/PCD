"""
Enrichissement B2B — Mock + Grok (xAI) AI Scraper
---------------------------------------------------
POST /enrich/company/mock  → Deterministic mock DB (3 Tunisian companies)
POST /enrich/grok          → Real AI enrichment via Grok API (api.x.ai)
"""

import os
import json
import httpx

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# ── Mock B2B Database (3 fausses entreprises tunisiennes) ──────────────────
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
    """
    Mock B2B Enrichment — deterministic lookup from internal DB.
    Returns full data if company name matches, partial otherwise.
    """
    key = payload.company_name.lower().replace(" ", "").replace("-", "").replace("_", "")

    matched = None
    for db_key, db_data in MOCK_DB.items():
        if db_key in key or key in db_key:
            matched = db_data
            break

    if matched:
        print(f"[ENRICH MOCK] Match found for '{payload.company_name}' → {matched['company_name']}")
        return {"status": "success", "source": "mock_b2b_api", "data": matched}
    else:
        print(f"[ENRICH MOCK] No match for '{payload.company_name}' — returning partial.")
        return {
            "status": "partial",
            "source": "mock_b2b_api",
            "missing_fields": ["website", "employees", "sector", "description", "linkedin_followers", "founded_year"],
            "message": "Entreprise non trouvée dans la base mock. Saisie manuelle requise.",
        }


# ── Grok (xAI) AI Enrichment endpoint ─────────────────────────────────────
GROK_API_URL = "https://api.x.ai/v1/chat/completions"
GROK_MODEL = "grok-beta"

SYSTEM_PROMPT = (
    "You are a financial data extractor for a Tunisian credit scoring platform. "
    "The user will give you a Tunisian company name. "
    "Return ONLY a valid JSON object with these fields: "
    "'website' (string or null), 'sector' (string or null), 'estimated_employees' (integer or null). "
    "If you don't know a value, use null. Do not add any explanation, only output the JSON."
)


@router.post("/grok")
async def enrich_company_grok(payload: EnrichRequest):
    """
    AI-powered enrichment via Grok API (xAI).
    Loads GROK_API_KEY from environment variables.
    Returns structured company data extracted by the LLM.
    """
    api_key = os.getenv("GROK_API_KEY")
    if not api_key:
        print("[GROK] GROK_API_KEY not set — returning mock fallback.")
        raise HTTPException(
            status_code=503,
            detail="Grok API key not configured. Set GROK_API_KEY in your .env file."
        )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    body = {
        "model": GROK_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Company name: {payload.company_name}"},
        ],
        "temperature": 0.1,
        "max_tokens": 256,
    }

    print(f"[GROK] Sending request to Grok API for company: '{payload.company_name}'")

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(GROK_API_URL, headers=headers, json=body)
            response.raise_for_status()

        grok_data = response.json()
        raw_content = grok_data["choices"][0]["message"]["content"].strip()
        print(f"[GROK] Raw response: {raw_content}")

        # Parse the JSON the model returned
        try:
            extracted = json.loads(raw_content)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            import re
            match = re.search(r"\{.*\}", raw_content, re.DOTALL)
            if match:
                extracted = json.loads(match.group())
            else:
                raise ValueError("Could not parse JSON from Grok response")

        return {
            "status": "success",
            "source": "grok_ai",
            "company_name": payload.company_name,
            "data": {
                "website": extracted.get("website"),
                "sector": extracted.get("sector"),
                "estimated_employees": extracted.get("estimated_employees"),
            }
        }

    except httpx.HTTPStatusError as e:
        print(f"[GROK ERROR] HTTP {e.response.status_code}: {e.response.text}")
        raise HTTPException(
            status_code=502,
            detail=f"Grok API returned error {e.response.status_code}."
        )
    except Exception as e:
        print(f"[GROK ERROR] Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Enrichissement Grok échoué: {str(e)}"
        )
