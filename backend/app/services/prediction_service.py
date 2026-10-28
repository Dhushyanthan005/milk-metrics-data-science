from typing import Any, Dict
import numpy as np
from datetime import datetime
from pathlib import Path

from app.ml.model_loader import model_loader
from app.utils.logger import logger
from app.utils.exceptions import ModelNotFoundError


class PredictionService:
    """Service to wrap model prediction logic and provide metadata.

    The underlying model and encoder are loaded once by `model_loader` at
    application startup. This class focuses on converting validated inputs
    into the form expected by the trained model and returning metadata.
    """

    def __init__(self):
        self.loader = model_loader

    def _compute_model_version(self) -> str:
        # Prefer model attribute 'version' if present otherwise use file mtime
        model = self.loader.get_model()
        version = getattr(model, 'version', None)
        if version:
            return str(version)
        # Fallback to file modified timestamp
        model_path = Path(self.loader.model_dir) / self.loader.model_file
        try:
            mtime = datetime.utcfromtimestamp(model_path.stat().st_mtime)
            return mtime.isoformat() + 'Z'
        except Exception:
            return 'unknown'

    def _confidence_message(self, data: Dict[str, Any]) -> str:
        # Heuristic confidence scoring based on feature ranges
        issues = []
        if data['age'] > 15:
            issues.append('age unusually high')
        if not (1.0 <= data['body_condition_score'] <= 5.0):
            issues.append('body condition score out of typical range')
        if data['feed_quantity'] <= 0:
            issues.append('feed quantity zero or negative')
        if issues:
            return f"Low confidence: {', '.join(issues)}"
        return 'Normal confidence'

    def predict_with_meta(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Run prediction and return metadata.

        `data` is expected to be validated (Pydantic) and contain keys matching
        the PredictRequest fields.
        """
        try:
            model = self.loader.get_model()
            encoder = None
            try:
                encoder = self.loader.get_encoder()
            except ModelNotFoundError:
                encoder = None

            # Preprocess input into numeric features
            from app.services.preprocessing_service import PreprocessingService

            prep = PreprocessingService()
            X = prep.prepare(data)

            preds = model.predict(X)
            prediction = float(preds[0])

            meta = {
                'predicted_milk_yield': prediction,
                'prediction_time': datetime.utcnow(),
                'model_version': self._compute_model_version(),
                'confidence_message': self._confidence_message(data),
            }
            return meta

        except ModelNotFoundError:
            logger.exception('Model artifacts missing for prediction')
            raise
        except Exception:
            logger.exception('Unexpected error during prediction')
            raise

    def _fallback_numeric_transform(self, raw_list):
        # Convert categorical values (breed, season) into stable numeric features
        def cat_to_num(val: Any) -> float:
            if isinstance(val, (int, float)):
                return float(val)
            # stable hash-based mapping
            return float(abs(hash(str(val))) % 1000) / 100.0

        numeric = [cat_to_num(v) for v in raw_list]
        return np.array(numeric, dtype=float).reshape(1, -1)

