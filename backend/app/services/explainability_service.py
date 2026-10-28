from typing import Any, Dict, List, Tuple
import numpy as np
import pandas as pd
import xgboost as xgb

from app.ml.model_loader import model_loader
from app.services.preprocessing_service import PreprocessingService
from app.utils.logger import logger
from app.utils.exceptions import ModelNotFoundError

DISPLAY_NAMES: Dict[str, str] = {
    'Previous_Week_Avg_Yield': 'Previous Week Average Yield',
    'Feed_Quantity_kg': 'Feed Quantity',
    'Water_Intake_L': 'Water Intake',
    'Ambient_Temperature_C': 'Ambient Temperature',
    'Body_Condition_Score': 'Body Condition Score',
    'Days_in_Milk': 'Days in Milk',
    'Disease_Status': 'Disease Symptoms Status',
    'Age_Months': 'Age (Months)',
    'Weight_kg': 'Body Weight',
    'Breed': 'Cattle Breed',
    'Season': 'Season',
    'Housing_Score': 'Housing Quality Score',
    'Humidity_percent': 'Relative Humidity',
    'Walking_Distance_km': 'Walking Distance',
    'Grazing_Duration_hrs': 'Grazing Duration',
    'Rumination_Time_hrs': 'Rumination Time',
    'Resting_Hours': 'Resting Hours',
    'Body_Temperature_C': 'Body Temperature',
    'Heart_Rate_bpm': 'Heart Rate',
    'Respiratory_Rate': 'Respiratory Rate',
    'Parity': 'Lactation Parity',
    'Lactation_Stage': 'Lactation Stage',
    'Feed_Type': 'Feed Type',
    'Milking_Interval_hrs': 'Milking Interval',
    'Management_System': 'Management System',
    'Climate_Zone': 'Climate Zone',
    'Region': 'Region',
    'Country': 'Country',
    'Cattle_ID': 'Cattle ID',
    'Farm_ID': 'Farm ID',
    'Date': 'Record Date',
    'FMD_Vaccine': 'FMD Vaccine',
    'Brucellosis_Vaccine': 'Brucellosis Vaccine',
    'HS_Vaccine': 'HS Vaccine',
    'BQ_Vaccine': 'BQ Vaccine',
    'Anthrax_Vaccine': 'Anthrax Vaccine',
    'IBR_Vaccine': 'IBR Vaccine',
    'BVD_Vaccine': 'BVD Vaccine',
    'Rabies_Vaccine': 'Rabies Vaccine',
}


class ExplainabilityService:
    """Computes SHAP feature importance contributions for individual predictions
    and generates farmer-friendly explanation summaries.
    """

    def __init__(self):
        self.loader = model_loader
        self.preprocessor = PreprocessingService()

    def _get_display_name(self, feature_name: str) -> str:
        return DISPLAY_NAMES.get(feature_name, feature_name.replace('_', ' ').title())

    def _format_value(self, val: Any) -> str:
        if isinstance(val, (int, float, np.integer, np.floating)):
            return f"{float(val):.1f}"
        return str(val)

    def explain(self, raw_input: Dict[str, Any], top_n: int = 5) -> Dict[str, Any]:
        """Compute SHAP contributions and build explanation response.

        Args:
            raw_input: Raw key-value dictionary from PredictRequest.
            top_n: Number of positive and negative factors to return.

        Returns:
            Dict containing predicted_milk_yield, base_value, positive_factors,
            negative_factors, and summary string.
        """
        model = self.loader.get_model()
        
        # 1. Preprocess input DataFrame matching exact 39 canonical features
        df = self.preprocessor.prepare(raw_input)
        
        # 2. Predict milk yield
        preds = model.predict(df)
        predicted_yield = round(float(preds[0]), 2)

        # 3. Calculate SHAP values using XGBoost native TreeSHAP
        try:
            dmatrix = xgb.DMatrix(df, enable_categorical=True)
            booster = model.get_booster()
            contribs = booster.predict(dmatrix, pred_contribs=True)[0]
            
            # The last element in contribs is the bias / expected base value
            feature_contribs = contribs[:-1]
            base_value = round(float(contribs[-1]), 2)
        except Exception as e:
            logger.exception("Failed computing native XGBoost SHAP contributions")
            raise RuntimeError(f"SHAP calculation error: {e}") from e

        # 4. Map contributions to feature names and input values
        positive_list = []
        negative_list = []

        for idx, col in enumerate(df.columns):
            impact = round(float(feature_contribs[idx]), 2)
            raw_val = df.iloc[0][col]
            val_str = self._format_value(raw_val)
            
            item = {
                'feature': col,
                'display_name': self._get_display_name(col),
                'impact': impact,
                'feature_value': val_str,
            }

            if impact > 0.01:
                positive_list.append(item)
            elif impact < -0.01:
                negative_list.append(item)

        # Sort positive factors descending (highest positive impact first)
        positive_factors = sorted(positive_list, key=lambda x: x['impact'], reverse=True)[:top_n]
        
        # Sort negative factors ascending (most negative impact first)
        negative_factors = sorted(negative_list, key=lambda x: x['impact'])[:top_n]

        # 5. Build farmer-friendly summary
        summary = self._generate_explanation_summary(predicted_yield, positive_factors, negative_factors)

        return {
            'predicted_milk_yield': predicted_yield,
            'base_value': base_value,
            'positive_factors': positive_factors,
            'negative_factors': negative_factors,
            'explanation_summary': summary,
        }

    def _generate_explanation_summary(
        self,
        predicted_yield: float,
        positive_factors: List[Dict[str, Any]],
        negative_factors: List[Dict[str, Any]]
    ) -> str:
        pos_parts = [f"{item['display_name']} (+{item['impact']} L)" for item in positive_factors[:2]]
        neg_parts = [f"{item['display_name']} ({item['impact']} L)" for item in negative_factors[:2]]

        summary = f"Predicted daily milk yield is {predicted_yield} L/day. "

        if pos_parts and neg_parts:
            summary += (
                f"The model associates this result primarily with favorable factors like {', '.join(pos_parts)}, "
                f"while factors such as {', '.join(neg_parts)} exert a downward impact on predicted yield."
            )
        elif pos_parts:
            summary += f"The model associates this result primarily with favorable factors like {', '.join(pos_parts)}."
        elif neg_parts:
            summary += f"The model associates this result primarily with downward factors like {', '.join(neg_parts)}."
        else:
            summary += "Input conditions align closely with baseline average herd performance."

        return summary
