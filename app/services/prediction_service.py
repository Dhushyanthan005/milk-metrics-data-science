from app.ml_models.predictor import DummyModel
from app.utils.exceptions import DomainException
from app.utils.logger import logger
from app.models.schemas import MilkInput


class PredictionService:
    def __init__(self):
        # In production this would load a persisted model (joblib, pickle, etc.)
        self.model = DummyModel()

    def predict(self, input: MilkInput) -> float:
        try:
            features = [
                input.parity,
                input.days_in_milk,
                input.milk_yield_last,
                input.feed_quality_score,
                input.temperature,
            ]
            logger.debug(f"Features: {features}")
            pred = self.model.predict([features])
            return float(pred[0])
        except Exception as e:
            logger.exception("Prediction failed")
            raise DomainException("Prediction failed") from e
