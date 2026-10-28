from fastapi import APIRouter, Query, HTTPException, status
from typing import List
from app.utils.mongo import get_predictions_collection
from app.utils.logger import logger
from bson import ObjectId
from app.schemas.prediction import ErrorResponse

router = APIRouter()


def _serialize(doc: dict) -> dict:
    d = dict(doc)
    _id = d.pop('_id', None)
    if _id is not None:
        try:
            d['id'] = str(_id)
        except Exception:
            d['id'] = _id
    return d


@router.get(
    '/history',
    status_code=status.HTTP_200_OK,
    summary='Prediction history',
    description='Return most recent predictions stored in the database (sorted by timestamp desc).',
    responses={200: {'description': 'List of recent prediction records'}, 500: {'model': ErrorResponse}},
)
async def get_history(limit: int = Query(50, ge=1, le=500)) -> List[dict]:
    try:
        col = get_predictions_collection()
        cursor = col.find().sort('timestamp', -1).limit(limit)
        items = [_serialize(doc) for doc in cursor]
        return items
    except Exception:
        logger.exception('Failed to fetch prediction history')
        raise HTTPException(status_code=500, detail='Failed to fetch prediction history')
