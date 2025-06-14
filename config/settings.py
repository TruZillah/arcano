import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings

# Get the project root directory
PROJECT_ROOT = Path(__file__).parent.parent

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Arcano"
    APP_ENV: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 3000
    
    # Firebase
    FIREBASE_CREDENTIAL_PATH: str = str(PROJECT_ROOT / "serviceAccountKey.json")
    
    # Google Cloud
    GOOGLE_CLOUD_PROJECT: Optional[str] = None
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None
    
    # Ollama
    OLLAMA_HOST: str = "localhost"
    OLLAMA_PORT: int = 11434
    OLLAMA_MODELS: list[str] = ["llama3", "codellama"]
    
    # Security
    JWT_SECRET: str = "your-secret-key"  # Change in production
    
    # File Storage
    DATA_DIR: Path = PROJECT_ROOT / "data"
    CHAT_LOGS_DIR: Path = DATA_DIR / "chat_logs"
    USER_MEMORY_DIR: Path = DATA_DIR / "user_memory"
    LLM_CACHE_DIR: Path = DATA_DIR / "llm_cache"
    
    class Config:
        env_file = str(PROJECT_ROOT / ".env")
        case_sensitive = True
        extra = "allow"  # Allow extra fields

# Create settings instance
settings = Settings()

# Ensure required directories exist
for directory in [settings.DATA_DIR, settings.CHAT_LOGS_DIR, 
                 settings.USER_MEMORY_DIR, settings.LLM_CACHE_DIR]:
    directory.mkdir(parents=True, exist_ok=True) 