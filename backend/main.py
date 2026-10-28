from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import prediction_router, analytics_router, feature_importance_router, history_router, explainability_router
from app.config.settings import settings
from app.utils.logger import setup_logging, logger
from app.ml.model_loader import init_model, model_loader
from app.utils.exceptions import ModelNotFoundError

setup_logging()

app = FastAPI(
    title=settings.APP_NAME,
    description="Smart Dairy Farm Analytics API — prediction, analytics, and model insights.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(feature_importance_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(explainability_router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    try:
        init_model()
        # expose on app.state for convenience
        app.state.model = model_loader.get_model()
        try:
            app.state.encoder = model_loader.get_encoder()
        except ModelNotFoundError:
            app.state.encoder = None
    except ModelNotFoundError:
        logger.exception("Critical model artifact missing during startup; failing fast")
        raise


@app.get("/")
async def health():
    return {"status": "ok", "service": settings.APP_NAME}
