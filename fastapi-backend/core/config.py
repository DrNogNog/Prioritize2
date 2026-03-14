from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path("/app") if Path("/app").exists() else Path(__file__).resolve().parents[3]

class Settings(BaseSettings):
    DATABASE_URL: str

    # OpenAI configuration
    OPENAI_API_KEY: str
    OPENAI_API_BASE: str = "https://api.openai.com"
    OPENAI_MODEL: str = "gpt-3.5-turbo"

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

settings = Settings()
