from pydantic import BaseModel, Field
from typing import Optional


class MilkInput(BaseModel):
    cow_id: Optional[str] = Field(None, description="Cow identifier")
    parity: int = Field(..., ge=0, description="Number of calvings")
    days_in_milk: int = Field(..., ge=0, description="Days in milk")
    milk_yield_last: float = Field(..., ge=0, description="Last recorded milk yield")
    feed_quality_score: float = Field(..., ge=0, le=1, description="Feed quality normalized 0-1")
    temperature: float = Field(..., description="Ambient temperature C")


class PredictionResponse(BaseModel):
    prediction: float
    unit: str
