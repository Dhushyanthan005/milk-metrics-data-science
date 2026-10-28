from fastapi import APIRouter, HTTPException
from fastapi import status
from app.schemas.prediction import PredictRequest, PredictResponse, ErrorResponse
from app.services.prediction_service import PredictionService
from app.utils.exceptions import ModelNotFoundError
from app.utils.logger import logger
from datetime import datetime
from app.utils.mongo import get_predictions_collection

router = APIRouter()


@router.post(
    "/predict",
    response_model=PredictResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict milk yield",
    description="Run the trained XGBoost model to predict daily milk yield for a cow. Returns prediction and metadata.",
    responses={
        400: {"model": ErrorResponse, "description": "Bad request / validation error"},
        422: {"description": "Validation error (request body)"},
        503: {"model": ErrorResponse, "description": "Model unavailable"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def predict(req: PredictRequest):
    """Compute milk yield prediction from input features.

    Example request shown in the schema for `PredictRequest`.
    """
    service = PredictionService()
    try:
        meta = service.predict_with_meta(req.dict())
        # Ensure prediction_time is a datetime for Pydantic
        if isinstance(meta['prediction_time'], str):
            # parse if string
            meta['prediction_time'] = datetime.fromisoformat(meta['prediction_time'])

        # Persist prediction to MongoDB (best-effort)
        try:
            col = get_predictions_collection()
            doc = {
                'timestamp': datetime.utcnow(),
                'input_features': req.dict(),
                'predicted_yield': meta['predicted_milk_yield'],
                'prediction_time': meta['prediction_time'],
                'model_version': meta['model_version'],
            }
            try:
                col.insert_one(doc)
            except Exception:
                logger.exception('Failed to persist prediction to MongoDB')
        except Exception:
            logger.debug('MongoDB not configured or unavailable; skipping persistence')

        return PredictResponse(
            predicted_milk_yield=meta['predicted_milk_yield'],
            prediction_time=meta['prediction_time'],
            model_version=meta['model_version'],
            confidence_message=meta['confidence_message'],
        )
    except ModelNotFoundError as e:
        logger.error(f"Model not available: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="Prediction failed")
