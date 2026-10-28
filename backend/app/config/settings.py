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
    # model directory and filenames (relative to backend root)
    MODEL_DIR: str = "app/models"
    MODEL_FILE: str = "milk_yield_prediction_model.pkl"
    ENCODER_FILE: str = "encoder.pkl"
    # MongoDB configuration
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB: str = "smart_dairy"
    PREDICTIONS_COLLECTION: str = "predictions"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()

# Mongo settings
try:
    # Allow access from other modules
    MONGO_URI = settings.__dict__.get('MONGO_URI', None)
except Exception:
    MONGO_URI = None
