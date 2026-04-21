"""
Application configuration via environment variables.
Uses pydantic-settings to read from .env file automatically.
"""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration loaded from .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # silently ignore unknown .env keys
    )

    # Database
    DATABASE_URL: str = "sqlite:///./finscore.db"

    # JWT
    SECRET_KEY: str = "finscore_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # ML
    ML_MODELS_DIR: str = "./ml_models"

    # Groq AI enrichment (optional)
    GROQ_API_KEY: Optional[str] = None


settings = Settings()
