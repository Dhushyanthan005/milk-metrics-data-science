from fastapi import APIRouter, status
from app.services.analytics_service import AnalyticsService
from app.schemas.prediction import ErrorResponse

router = APIRouter()


@router.get(
    "/analytics",
    status_code=status.HTTP_200_OK,
    summary="Farm analytics",
    description="Aggregate analytics computed from stored farm observations (milk yield, temperature, feed).",
    responses={200: {"description": "Aggregated metrics"}, 500: {"model": ErrorResponse}},
)
async def get_analytics():
    svc = AnalyticsService()
    stats = svc.compute()
    return stats
