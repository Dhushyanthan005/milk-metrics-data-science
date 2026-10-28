from typing import Optional
from pymongo import MongoClient
from pymongo.collection import Collection
from app.config.settings import settings
from app.utils.logger import logger


_client: Optional[MongoClient] = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        uri = settings.MONGO_URI
        logger.info(f"Connecting to MongoDB at {uri}")
        _client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    return _client


def get_db(name: Optional[str] = None):
    client = get_client()
    return client[name or settings.MONGO_DB]


def get_predictions_collection() -> Collection:
    db = get_db()
    return db[settings.PREDICTIONS_COLLECTION]


def check_mongo_connection() -> bool:
    try:
        client = get_client()
        client.admin.command('ping')
        return True
    except Exception as e:
        logger.warning(f"MongoDB connection check failed: {e}")
        return False

