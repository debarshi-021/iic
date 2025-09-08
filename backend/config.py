import os
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

class Settings:
    def __init__(self) -> None:
        self.ml_api_url: str = os.getenv("ML_API_URL", "http://127.0.0.1:8000/predict_maintenance")
        self.database_url: str = os.getenv("DB_URL", os.getenv("DATABASE_URL", "sqlite:///./railway.db"))
        self.api_host: str = os.getenv("API_HOST", "0.0.0.0")
        self.api_port: int = int(os.getenv("API_PORT", "5000"))
        self.debug: bool = os.getenv("DEBUG", "true").lower() == "true"

settings = Settings()
