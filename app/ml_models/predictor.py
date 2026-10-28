import numpy as np


class DummyModel:
    """A tiny deterministic dummy predictor for development and testing.

    Replace with a real trained model (joblib / pickle) in production.
    """

    def predict(self, X):
        X = np.array(X)
        base = 10.0
        preds = (
            base
            + 0.5 * X[:, 2]
            + 20.0 * X[:, 3]
            - 0.1 * X[:, 1]
            - 0.2 * X[:, 0]
            - 0.05 * X[:, 4]
        )
        return preds.tolist()
