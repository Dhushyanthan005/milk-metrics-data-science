from typing import Dict, List, Tuple
import colorsys

from app.ml.model_loader import model_loader
from app.utils.logger import logger
from app.utils.exceptions import ModelNotFoundError


class FeatureService:
    """Extract feature importances from the loaded model and format them
    for Chart.js consumption.
    """

    def __init__(self):
        self.loader = model_loader

    def _get_raw_importances(self) -> Dict[str, float]:
        model = self.loader.get_model()
        # Case 1: sklearn-style estimator with `feature_importances_`
        if hasattr(model, 'feature_importances_'):
            importances = list(map(float, model.feature_importances_.tolist()))
            # try to get feature names
            feature_names = None
            if hasattr(model, 'feature_names_in_'):
                feature_names = [str(name) for name in getattr(model, 'feature_names_in_')]
            elif hasattr(model, 'get_booster'):
                try:
                    booster = model.get_booster()
                    feature_names = getattr(booster, 'feature_names', None)
                except Exception:
                    feature_names = None

            if feature_names and len(feature_names) == len(importances):
                return {name: imp for name, imp in zip(feature_names, importances)}
            # fallback to generic feature ids
            return {f'f{i}': imp for i, imp in enumerate(importances)}

        # Case 2: xgboost scikit-learn wrapper exposing get_booster()
        if hasattr(model, 'get_booster'):
            try:
                booster = model.get_booster()
                score = booster.get_score(importance_type='gain')
                # get_score returns dict like {'f0': 1.23} or {'feature_name': 1.23}
                return {k: float(v) for k, v in score.items()}
            except Exception:
                logger.exception('Failed extracting booster score')

        # Case 3: raw xgboost Booster
        try:
            # Imported lazily to avoid hard dependency in type checks
            import xgboost as xgb
            if isinstance(model, xgb.core.Booster):
                score = model.get_score(importance_type='gain')
                return {k: float(v) for k, v in score.items()}
        except Exception:
            # not an xgboost Booster or xgboost not installed/usable
            pass

        raise ValueError('Unable to extract feature importances from model')

    def _top_n(self, importances: Dict[str, float], n: int = 20) -> List[Tuple[str, float]]:
        items = sorted(importances.items(), key=lambda kv: kv[1], reverse=True)
        return items[:n]

    def _gen_colors(self, count: int) -> List[str]:
        colors = []
        for i in range(count):
            h = (i / max(1, count))
            r, g, b = colorsys.hsv_to_rgb(h, 0.6, 0.9)
            colors.append(f'rgba({int(r*255)},{int(g*255)},{int(b*255)},0.7)')
        return colors

    def top_feature_importance_chartjs(self, top_n: int = 20) -> Dict:
        """Return a Chart.js-compatible JSON payload containing labels and dataset.

        Raises `ModelNotFoundError` if the model hasn't been loaded.
        """
        # ensure model exists
        try:
            _ = self.loader.get_model()
        except Exception:
            raise ModelNotFoundError('Model not loaded')

        raw = self._get_raw_importances()
        top = self._top_n(raw, top_n)

        labels = [k for k, _ in top]
        data = [v for _, v in top]
        colors = self._gen_colors(len(labels))

        chart = {
            'labels': labels,
            'datasets': [
                {
                    'label': 'Feature importance',
                    'data': data,
                    'backgroundColor': colors,
                }
            ],
        }
        return chart
