from typing import Dict, Any
import logging
from pathlib import Path
from datetime import datetime
import pandas as pd

from app.utils.logger import logger
from app.utils.mongo import get_predictions_collection, check_mongo_connection


class AnalyticsService:
    """Compute analytics from stored predictions in MongoDB or CSV dataset.
    """

    DEFAULT_PATH = Path('uploads') / 'data.csv'

    def __init__(self, path: Path = None):
        self.path = path or self.DEFAULT_PATH

    def load_data(self) -> pd.DataFrame:
        # Try loading from MongoDB predictions collection first
        try:
            col = get_predictions_collection()
            docs = list(col.find({}, {'predicted_yield': 1, 'input_features': 1, 'timestamp': 1, 'prediction_time': 1}))
            if docs:
                records = []
                for d in docs:
                    feats = d.get('input_features', {}) or {}
                    y = d.get('predicted_yield')
                    if y is None:
                        y = feats.get('milk_yield')
                    
                    ts = d.get('timestamp') or d.get('prediction_time')
                    records.append({
                        'milk_yield': y,
                        'temperature': feats.get('temperature') or feats.get('Ambient_Temperature_C'),
                        'humidity': feats.get('humidity') or feats.get('Humidity_percent'),
                        'feed_quantity': feats.get('feed_quantity') or feats.get('Feed_Quantity_kg'),
                        'breed': feats.get('breed') or feats.get('Breed'),
                        'season': feats.get('season') or feats.get('Season'),
                        'timestamp': ts,
                    })
                df = pd.DataFrame(records)
                if not df.empty and df['milk_yield'].notna().any():
                    return df
        except Exception as e:
            logger.warning(f"Failed loading analytics from MongoDB: {e}")

        # Fallback to CSV if MongoDB is empty or unreachable
        if not self.path.exists():
            logger.warning(f"Analytics data file not found: {self.path}")
            return pd.DataFrame()
        try:
            df = pd.read_csv(self.path)
            return df
        except Exception as e:
            logger.exception("Failed loading analytics data from CSV")
            return pd.DataFrame()

    def compute(self) -> Dict[str, Any]:
        df = self.load_data()
        if df.empty:
            return {
                'average_milk_yield': None,
                'highest_yield': None,
                'lowest_yield': None,
                'average_temperature': None,
                'average_humidity': 65.0,
                'average_feed_quantity': None,
                'total_predictions': 0,
                'todays_runs': 0,
                'breed_distribution': {},
                'season_distribution': {},
            }

        res = {}
        total_predictions = len(df)
        res['total_predictions'] = total_predictions

        # Calculate today's runs dynamically based on timestamp column
        todays_runs = 0
        today_date = datetime.utcnow().date()
        if 'timestamp' in df.columns and df['timestamp'].notna().any():
            try:
                for ts in df['timestamp']:
                    if ts is not None:
                        if isinstance(ts, str):
                            dt = pd.to_datetime(ts).date()
                        elif hasattr(ts, 'date'):
                            dt = ts.date()
                        else:
                            dt = pd.to_datetime(ts).date()
                        if dt == today_date:
                            todays_runs += 1
            except Exception as e:
                logger.warning(f"Error computing today's runs: {e}")
                todays_runs = 0

        res['todays_runs'] = todays_runs

        if 'milk_yield' in df.columns and df['milk_yield'].notna().any():
            res['average_milk_yield'] = round(float(df['milk_yield'].mean()), 2)
            res['highest_yield'] = round(float(df['milk_yield'].max()), 2)
            res['lowest_yield'] = round(float(df['milk_yield'].min()), 2)
        else:
            res['average_milk_yield'] = None
            res['highest_yield'] = None
            res['lowest_yield'] = None

        if 'temperature' in df.columns and df['temperature'].notna().any():
            res['average_temperature'] = round(float(df['temperature'].mean()), 2)
        else:
            res['average_temperature'] = None

        if 'humidity' in df.columns and df['humidity'].notna().any():
            res['average_humidity'] = round(float(df['humidity'].mean()), 1)
        elif 'Humidity_percent' in df.columns and df['Humidity_percent'].notna().any():
            res['average_humidity'] = round(float(df['Humidity_percent'].mean()), 1)
        else:
            res['average_humidity'] = 65.0

        if 'feed_quantity' in df.columns and df['feed_quantity'].notna().any():
            res['average_feed_quantity'] = round(float(df['feed_quantity'].mean()), 2)
        else:
            res['average_feed_quantity'] = None

        if 'breed' in df.columns and df['breed'].notna().any():
            dist = df['breed'].value_counts(dropna=True).to_dict()
            res['breed_distribution'] = {str(k): int(v) for k, v in dist.items()}
        else:
            res['breed_distribution'] = {}

        if 'season' in df.columns and df['season'].notna().any():
            dist = df['season'].value_counts(dropna=True).to_dict()
            res['season_distribution'] = {str(k): int(v) for k, v in dist.items()}
        else:
            res['season_distribution'] = {}

        return res


