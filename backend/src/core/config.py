from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # API Configuration
    api_title: str = "Echo Notes API"
    api_version: str = "1.0.0"
    debug: bool = False

    # Database
    database_url: str = "sqlite:///./echo_notes.db"

    # OpenAI Configuration
    openai_api_key: Optional[str] = None

    # ElevenLabs Configuration
    elevenlabs_api_key: Optional[str] = None

    # Whisper Configuration
    whisper_model: str = "base"
    max_audio_duration: int = 300  # 5 minutes in seconds

    # Storage Configuration
    upload_dir: str = "./data/uploads"
    max_file_size: int = 50 * 1024 * 1024  # 50MB

    # CORS Configuration
    allowed_origins: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://echo-notes-one.vercel.app",
    ]

    @property
    def cors_origins(self) -> list:
        """Get CORS origins from environment variable or default"""
        import json

        cors_env = os.getenv("CORS_ORIGINS")
        if cors_env:
            try:
                return json.loads(cors_env)
            except json.JSONDecodeError:
                pass
        return self.allowed_origins

    # Logging
    log_level: str = "INFO"
    log_file: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = False


# Create settings instance
settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.upload_dir, exist_ok=True)
