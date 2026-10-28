from fastapi import APIRouter, HTTPException, status
from app.schemas.prediction import PredictRequest, PredictExplanationResponse, ErrorResponse
from app.services.explainability_service import ExplainabilityService
from app.utils.exceptions import ModelNotFoundError
from app.utils.logger import logger

router = APIRouter()


@router.post(
    "/predict/explanation",
    response_model=PredictExplanationResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict milk yield with SHAP explanation",
    description="Calculates predicted milk yield along with SHAP feature contribution breakdown (positive and negative factors) for individual prediction analysis.",
    responses={
        400: {"model": ErrorResponse, "description": "Bad request / validation error"},
        422: {"description": "Validation error in request body"},
        503: {"model": ErrorResponse, "description": "Model unavailable"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def predict_explanation(req: PredictRequest):
    """Run model prediction and return SHAP marginal factor contributions."""
    svc = ExplainabilityService()
    try:
        explanation = svc.explain(req.dict())
        return PredictExplanationResponse(**explanation)
    except ModelNotFoundError as e:
        logger.error(f"Model not available for explanation: {e}")
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to calculate SHAP prediction explanation")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to calculate SHAP prediction explanation")
