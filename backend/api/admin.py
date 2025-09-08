from fastapi import APIRouter
from sqlmodel import select
from backend.db import get_session
from backend.models import Fitting, MLPrediction

router = APIRouter(prefix="/api/admin")

@router.get("/fittings_count")
def fittings_count():
    s = get_session()
    total = s.exec(select(Fitting)).count()
    return {"total": total}

@router.get("/urgent")
def urgent():
    s = get_session()
    stmt = select(MLPrediction).where(MLPrediction.maintenance_priority == "Urgent")
    results = s.exec(stmt).all()
    return {"urgent_count": len(results), "items": [r.dict() for r in results[:100]]}
