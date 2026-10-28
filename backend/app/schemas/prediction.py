from pydantic import BaseModel, Field, validator
from typing import Literal, Optional
from datetime import datetime


class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Error message describing the problem")




class PredictRequest(BaseModel):
    # Core fields
    breed: str = Field(..., min_length=1, description="Breed name")
    age: int = Field(..., ge=0, le=30, description="Age in years")
    weight: float = Field(..., gt=0, le=2000, description="Weight in kg")
    feed_quantity: float = Field(..., ge=0, description="Feed quantity kg/day")
    water_intake: float = Field(..., ge=0, description="Water intake liters/day")
    temperature: float = Field(..., description="Ambient temperature °C")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity percent")
    season: Literal['spring', 'summer', 'autumn', 'winter'] = Field(...)
    disease_status: bool = Field(False, description="Whether the cow shows disease symptoms")
    body_condition_score: float = Field(..., ge=1.0, le=5.0, description="BCS (1-5)")
    days_in_milk: int = Field(..., ge=0, description="Days since calving")

    # Additional model features (optional, with defaults resolved in preprocessing)
    cattle_id: Optional[int] = Field(None, description="Cattle identifier")
    region: Optional[str] = Field(None, description="Farm region")
    country: Optional[str] = Field(None, description="Farm country")
    climate_zone: Optional[str] = Field(None, description="Climate zone")
    management_system: Optional[str] = Field(None, description="Management system (Intensive, Extensive, etc.)")
    parity: Optional[int] = Field(None, ge=0, description="Parity (number of calvings)")
    lactation_stage: Optional[int] = Field(None, ge=1, le=4, description="Lactation stage (1-4)")
    feed_type: Optional[str] = Field(None, description="Type of feed")
    walking_distance_km: Optional[float] = Field(None, ge=0.0, description="Daily walking distance in km")
    grazing_duration_hrs: Optional[float] = Field(None, ge=0.0, le=24.0, description="Daily grazing duration in hours")
    rumination_time_hrs: Optional[float] = Field(None, ge=0.0, le=24.0, description="Daily rumination time in hours")
    resting_hours: Optional[float] = Field(None, ge=0.0, le=24.0, description="Daily resting hours")
    body_temperature_c: Optional[float] = Field(None, ge=30.0, le=45.0, description="Body temperature in °C")
    heart_rate_bpm: Optional[float] = Field(None, ge=30.0, le=150.0, description="Heart rate in bpm")
    respiratory_rate: Optional[float] = Field(None, ge=10.0, le=60.0, description="Respiratory rate")
    housing_score: Optional[float] = Field(None, ge=1.0, le=5.0, description="Housing score (1-5)")
    fmd_vaccine: Optional[int] = Field(None, ge=0, le=1, description="FMD vaccine status (0 or 1)")
    brucellosis_vaccine: Optional[int] = Field(None, ge=0, le=1, description="Brucellosis vaccine status (0 or 1)")
    hs_vaccine: Optional[int] = Field(None, ge=0, le=1, description="HS vaccine status (0 or 1)")
    bq_vaccine: Optional[int] = Field(None, ge=0, le=1, description="BQ vaccine status (0 or 1)")
    anthrax_vaccine: Optional[int] = Field(None, ge=0, le=1, description="Anthrax vaccine status (0 or 1)")
    ibr_vaccine: Optional[int] = Field(None, ge=0, le=1, description="IBR vaccine status (0 or 1)")
    bvd_vaccine: Optional[int] = Field(None, ge=0, le=1, description="BVD vaccine status (0 or 1)")
    rabies_vaccine: Optional[int] = Field(None, ge=0, le=1, description="Rabies vaccine status (0 or 1)")
    previous_week_avg_yield: Optional[float] = Field(None, ge=0.0, description="Previous week average milk yield in liters")
    milking_interval_hrs: Optional[int] = Field(None, ge=0, description="Milking interval in hours")
    date: Optional[str] = Field(None, description="Date of prediction (YYYY-MM-DD)")
    farm_id: Optional[int] = Field(None, description="Farm identifier")

    @validator('feed_quantity')
    def feed_must_be_reasonable(cls, v):
        if v > 100:
            raise ValueError('feed_quantity unusually large')
        return v


class PredictResponse(BaseModel):
    predicted_milk_yield: float
    prediction_time: datetime
    model_version: str
    confidence_message: str

    class Config:
        schema_extra = {
            'example': {
                'predicted_milk_yield': 22.4,
                'prediction_time': datetime.utcnow().isoformat(),
                'model_version': '2026-07-09T12:00:00Z',
                'confidence_message': 'Normal confidence'
            }
        }


class FeatureImpact(BaseModel):
    feature: str = Field(..., description="Original model feature name")
    display_name: str = Field(..., description="User-friendly display name")
    impact: float = Field(..., description="SHAP marginal impact contribution in Liters")
    feature_value: Optional[str] = Field(None, description="Input feature value formatted as string")


class PredictExplanationResponse(BaseModel):
    predicted_milk_yield: float
    base_value: float = Field(..., description="Baseline average prediction across population")
    positive_factors: list[FeatureImpact] = Field(..., description="Top positive contributing factors")
    negative_factors: list[FeatureImpact] = Field(..., description="Top negative contributing factors")
    explanation_summary: str = Field(..., description="Non-technical summary for farm management")


