try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Smart Dairy Farm Analytics & Milk Yield Prediction"
    DEBUG: bool = False
    CORS_ORIGINS: List[str] = ["*"]
    ENV: str = "development"
    MODEL_PATH: str = "ml_models/model.joblib"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
