from pathlib import Path
from typing import Optional
import joblib
import numpy as np

from app.config.settings import settings
from app.utils.logger import logger
from app.utils.exceptions import ModelNotFoundError


class ModelLoader:
    """Loads and holds the ML model and encoder once for the application lifetime.

    Usage:
        loader = ModelLoader()
        loader.load()
        model = loader.get_model()
    """

    def __init__(self, model_dir: Optional[str] = None, model_file: Optional[str] = None, encoder_file: Optional[str] = None):
        self.model_dir = Path(model_dir or settings.MODEL_DIR)
        self.model_file = model_file or settings.MODEL_FILE
        self.encoder_file = encoder_file or settings.ENCODER_FILE
        self.model = None
        self.encoder = None

    def _resolve_path(self, filename: str) -> Path:
        p = self.model_dir / filename
        return p

    def load(self) -> None:
        model_path = self._resolve_path(self.model_file)
        encoder_path = self._resolve_path(self.encoder_file)

        if not model_path.exists():
            logger.error(f"Model file not found at {model_path}")
            raise ModelNotFoundError(str(model_path))

        logger.info(f"Loading model from {model_path}")
        self.model = joblib.load(model_path)

        if not encoder_path.exists():
            logger.warning(f"Encoder file not found at {encoder_path}. Running without encoder.")
            self.encoder = None
        else:
            logger.info(f"Loading encoder from {encoder_path}")
            self.encoder = joblib.load(encoder_path)

        logger.info("Model loaded successfully")

    def get_model(self):
        if self.model is None:
            raise ModelNotFoundError("Model not loaded")
        return self.model

    def get_encoder(self):
        if self.encoder is None:
            raise ModelNotFoundError("Encoder not loaded")
        return self.encoder


# Module-level singleton to be initialized at startup
model_loader = ModelLoader()

def init_model():
    """Convenience function used from the app startup event to load the artifacts."""
    model_loader.load()
