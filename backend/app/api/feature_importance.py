from fastapi import APIRouter, HTTPException, status
from app.services.feature_service import FeatureService
from app.utils.exceptions import ModelNotFoundError
from app.utils.logger import logger
from app.schemas.prediction import ErrorResponse

router = APIRouter()


@router.get(
    "/feature-importance",
    status_code=status.HTTP_200_OK,
    summary="Feature importance",
    description="Return the top features by importance from the trained model formatted for Chart.js.",
    responses={200: {"description": "Chart.js payload"}, 503: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def feature_importance():
    svc = FeatureService()
    try:
        payload = svc.top_feature_importance_chartjs(top_n=20)
        return payload
    except ModelNotFoundError as e:
        logger.error(f"Model not available: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.exception("Failed to compute feature importance")
        raise HTTPException(status_code=500, detail="Failed to compute feature importance")
