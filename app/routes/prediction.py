from fastapi import APIRouter
from app.models.schemas import MilkInput, PredictionResponse
from app.services.prediction_service import PredictionService
from app.utils.logger import logger

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
async def predict(input: MilkInput):
    logger.info("Received prediction request")
    service = PredictionService()
    result = service.predict(input)
    return {"prediction": result, "unit": "liters"}
