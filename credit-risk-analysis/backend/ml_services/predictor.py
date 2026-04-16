"""
MOCKED ML Prediction Service for FinScore PME local testing.
Does not require scikit-learn or data science libraries to run.
"""

from typing import Any, Dict

class ModelLoader:
    def __init__(self) -> None:
        self.is_loaded: bool = False

    def load(self, models_dir: str | None = None) -> None:
        # Mock load
        self.is_loaded = True

    def predict(self, features: Dict[str, Any], top_n: int = 5) -> Dict[str, Any]:
        if not self.is_loaded:
            raise RuntimeError("ML models are not loaded. Cannot make predictions.")

        # Return a mocked successful response
        return {
            "score": 75,
            "risk_tier": "Low Risk",
            "decision": "Approved",
            "decision_explanation": "[MOCK] The solvability signal is strong across both model layers.",
            "probabilities": {
                "model1_financial": 0.7500,
                "model2_behavioral": 0.8200,
                "stacked_final": 0.7800,
            },
            "strengths": [
                {
                    "feature": "profit_margin",
                    "model": "Model 1",
                    "value": 0.25,
                    "shap_value": 0.15,
                    "description": "[MOCK] Strong profitability supports financing eligibility."
                }
            ],
            "weaknesses": [
                {
                    "feature": "banking_maturity_score",
                    "model": "Model 2",
                    "value": 3.0,
                    "shap_value": -0.05,
                    "description": "[MOCK] Low banking maturity increases risk."
                }
            ],
            "shap_explanations": {"mock": True}
        }

model_loader = ModelLoader()
