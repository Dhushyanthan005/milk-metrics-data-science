from typing import Any, Dict, List
import pandas as pd
from app.utils.logger import logger
from app.ml.model_loader import model_loader


class PreprocessingService:
    """Prepare and validate input data for model prediction.

    Responsibilities:
    - Maintain canonical model feature order
    - Map API input names (snake_case) to model feature names (PascalCase/units)
    - Handle missing values with sensible defaults
    - Cast columns appropriately, and convert object columns to 'category' dtype
    - Provide a `prepare` method returning a pandas DataFrame
    """

    feature_order: List[str] = [
        'Cattle_ID', 'Breed', 'Region', 'Country', 'Climate_Zone', 'Management_System',
        'Age_Months', 'Weight_kg', 'Parity', 'Lactation_Stage', 'Days_in_Milk',
        'Feed_Type', 'Feed_Quantity_kg', 'Water_Intake_L', 'Walking_Distance_km',
        'Grazing_Duration_hrs', 'Rumination_Time_hrs', 'Resting_Hours',
        'Body_Temperature_C', 'Heart_Rate_bpm', 'Respiratory_Rate',
        'Ambient_Temperature_C', 'Humidity_percent', 'Season', 'Housing_Score',
        'FMD_Vaccine', 'Brucellosis_Vaccine', 'HS_Vaccine', 'BQ_Vaccine',
        'Anthrax_Vaccine', 'IBR_Vaccine', 'BVD_Vaccine', 'Rabies_Vaccine',
        'Previous_Week_Avg_Yield', 'Body_Condition_Score', 'Milking_Interval_hrs',
        'Date', 'Farm_ID', 'Disease_Status'
    ]

    # sensible defaults for missing features
    defaults: Dict[str, Any] = {
        'Cattle_ID': 1,
        'Breed': 'Holstein',
        'Region': 'East',
        'Country': 'USA',
        'Climate_Zone': 'Temperate',
        'Management_System': 'Intensive',
        'Age_Months': 36,
        'Weight_kg': 650.0,
        'Parity': 2,
        'Lactation_Stage': 1,
        'Days_in_Milk': 45,
        'Feed_Type': 'Silage',
        'Feed_Quantity_kg': 15.0,
        'Water_Intake_L': 80.0,
        'Walking_Distance_km': 2.5,
        'Grazing_Duration_hrs': 4.0,
        'Rumination_Time_hrs': 8.0,
        'Resting_Hours': 12.0,
        'Body_Temperature_C': 38.5,
        'Heart_Rate_bpm': 60.0,
        'Respiratory_Rate': 20.0,
        'Ambient_Temperature_C': 22.0,
        'Humidity_percent': 65.0,
        'Season': 'Summer',
        'Housing_Score': 4.0,
        'FMD_Vaccine': 1,
        'Brucellosis_Vaccine': 1,
        'HS_Vaccine': 1,
        'BQ_Vaccine': 1,
        'Anthrax_Vaccine': 1,
        'IBR_Vaccine': 1,
        'BVD_Vaccine': 1,
        'Rabies_Vaccine': 1,
        'Previous_Week_Avg_Yield': 25.0,
        'Body_Condition_Score': 3.5,
        'Milking_Interval_hrs': 12,
        'Date': '2026-07-09',
        'Farm_ID': 1,
        'Disease_Status': 0,
    }

    def __init__(self):
        # The encoder is not used for XGBoost enable_categorical=True, but we check loader
        try:
            self.encoder = model_loader.get_encoder()
        except Exception:
            self.encoder = None

    def prepare(self, data: Dict[str, Any]) -> pd.DataFrame:
        """Main entry: validate, map input fields, impute, and return DataFrame.

        Returns a 1-row pandas DataFrame suitable for model.predict(df).
        """
        logger.debug(f"Preparing data: {data}")
        mapped = {}

        # 1. Map core input fields (translating snake_case to model schema)
        if 'breed' in data and data['breed'] is not None:
            mapped['Breed'] = str(data['breed']).title()
        if 'age' in data and data['age'] is not None:
            mapped['Age_Months'] = int(data['age']) * 12
        if 'weight' in data and data['weight'] is not None:
            mapped['Weight_kg'] = float(data['weight'])
        if 'feed_quantity' in data and data['feed_quantity'] is not None:
            mapped['Feed_Quantity_kg'] = float(data['feed_quantity'])
        if 'water_intake' in data and data['water_intake'] is not None:
            mapped['Water_Intake_L'] = float(data['water_intake'])
        if 'temperature' in data and data['temperature'] is not None:
            mapped['Ambient_Temperature_C'] = float(data['temperature'])
        if 'humidity' in data and data['humidity'] is not None:
            mapped['Humidity_percent'] = float(data['humidity'])
        if 'season' in data and data['season'] is not None:
            mapped['Season'] = str(data['season']).title()
        if 'disease_status' in data and data['disease_status'] is not None:
            mapped['Disease_Status'] = 1 if data['disease_status'] else 0
        if 'body_condition_score' in data and data['body_condition_score'] is not None:
            mapped['Body_Condition_Score'] = float(data['body_condition_score'])
        if 'days_in_milk' in data and data['days_in_milk'] is not None:
            mapped['Days_in_Milk'] = int(data['days_in_milk'])

        # 2. Map optional inputs
        optional_map = {
            'cattle_id': ('Cattle_ID', int),
            'region': ('Region', str),
            'country': ('Country', str),
            'climate_zone': ('Climate_Zone', str),
            'management_system': ('Management_System', str),
            'parity': ('Parity', int),
            'lactation_stage': ('Lactation_Stage', int),
            'feed_type': ('Feed_Type', str),
            'walking_distance_km': ('Walking_Distance_km', float),
            'grazing_duration_hrs': ('Grazing_Duration_hrs', float),
            'rumination_time_hrs': ('Rumination_Time_hrs', float),
            'resting_hours': ('Resting_Hours', float),
            'body_temperature_c': ('Body_Temperature_C', float),
            'heart_rate_bpm': ('Heart_Rate_bpm', float),
            'respiratory_rate': ('Respiratory_Rate', float),
            'housing_score': ('Housing_Score', float),
            'fmd_vaccine': ('FMD_Vaccine', int),
            'brucellosis_vaccine': ('Brucellosis_Vaccine', int),
            'hs_vaccine': ('HS_Vaccine', int),
            'bq_vaccine': ('BQ_Vaccine', int),
            'anthrax_vaccine': ('Anthrax_Vaccine', int),
            'ibr_vaccine': ('IBR_Vaccine', int),
            'bvd_vaccine': ('BVD_Vaccine', int),
            'rabies_vaccine': ('Rabies_Vaccine', int),
            'previous_week_avg_yield': ('Previous_Week_Avg_Yield', float),
            'milking_interval_hrs': ('Milking_Interval_hrs', int),
            'date': ('Date', str),
            'farm_id': ('Farm_ID', int),
        }

        for key, (model_key, cast_type) in optional_map.items():
            if key in data and data[key] is not None:
                try:
                    if cast_type == str:
                        mapped[model_key] = str(data[key]).title()
                    else:
                        mapped[model_key] = cast_type(data[key])
                except Exception:
                    logger.warning(f"Failed to cast {key}={data[key]} to {cast_type}; using default.")

        # 3. Construct canonical row with defaults for missing features
        final_row = {}
        for feature in self.feature_order:
            if feature in mapped:
                final_row[feature] = mapped[feature]
            else:
                final_row[feature] = self.defaults[feature]

        df = pd.DataFrame([final_row], columns=self.feature_order)

        # Predefined categories mapping to match training encoding index orders
        categories_map = {
            'Breed': ['Holstein', 'Jersey', 'Guernsey', 'Brown Swiss', 'Ayrshire'],
            'Region': ['East', 'West', 'North', 'South'],
            'Country': ['USA', 'Canada', 'UK', 'Australia', 'India'],
            'Climate_Zone': ['Temperate', 'Tropical', 'Arid', 'Continental'],
            'Management_System': ['Intensive', 'Semi-Intensive', 'Extensive'],
            'Feed_Type': ['Silage', 'Hay', 'Pasture', 'Mixed', 'Concentrate'],
            'Season': ['Spring', 'Summer', 'Autumn', 'Winter'],
        }

        # 4. Cast string/object columns to categorical dtypes
        for col in df.columns:
            if col in categories_map:
                df[col] = pd.Categorical(df[col], categories=categories_map[col])
            elif df[col].dtype == 'object':
                df[col] = df[col].astype('category')

        return df


def prepare_for_prediction(data: Dict[str, Any]) -> pd.DataFrame:
    """Helper function for quick use without instantiating the class."""
    return PreprocessingService().prepare(data)
