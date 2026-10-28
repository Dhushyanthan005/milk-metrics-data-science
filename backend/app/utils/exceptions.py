class ModelNotFoundError(Exception):
    """Raised when model or encoder files are missing or cannot be loaded."""

    def __init__(self, path: str):
        self.path = path
        super().__init__(f"Model artifact not found: {path}")
