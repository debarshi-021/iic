from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db import get_db
from schemas import AdminStats, UrgentMaintenanceItem, FittingDetail
from crud import (
    get_admin_stats, get_urgent_maintenance_items,
    get_fitting_by_uid, get_deployments_by_fitting,
    get_latest_ml_prediction, get_vendor
)

router = APIRouter()

@router.get("/fittings_count")
async def get_fittings_count(db: Session = Depends(get_db)):
    """
    Get total count of fittings
    """
    from crud import get_fittings_count
    count = get_fittings_count(db)
    return {"total_fittings": count}

@router.get("/urgent", response_model=List[UrgentMaintenanceItem])
async def get_urgent_maintenance(db: Session = Depends(get_db)):
    """
    Get list of fittings requiring urgent maintenance
    """
    urgent_items = get_urgent_maintenance_items(db)
    return [UrgentMaintenanceItem(**item) for item in urgent_items]

@router.get("/stats", response_model=AdminStats)
async def get_admin_statistics(db: Session = Depends(get_db)):
    """
    Get comprehensive admin statistics
    """
    stats = get_admin_stats(db)
    return AdminStats(**stats)

@router.get("/fittings/{uid}", response_model=FittingDetail)
async def get_fitting_details(uid: str, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific fitting
    """
    fitting = get_fitting_by_uid(db, uid)
    if not fitting:
        raise HTTPException(status_code=404, detail=f"Fitting with UID {uid} not found")
    
    deployments = get_deployments_by_fitting(db, fitting.id)
    latest_ml_prediction = get_latest_ml_prediction(db, fitting.id)
    vendor_info = get_vendor(db, fitting.vendor_code)
    
    return FittingDetail(
        fitting=fitting,
        deployments=deployments,
        latest_ml_prediction=latest_ml_prediction,
        vendor_info=vendor_info
    )

@router.get("/dashboard")
async def get_dashboard_data(db: Session = Depends(get_db)):
    """
    Get dashboard data for admin panel
    """
    stats = get_admin_stats(db)
    urgent_items = get_urgent_maintenance_items(db)
    
    return {
        "stats": stats,
        "urgent_maintenance": urgent_items[:10],  # Top 10 urgent items
        "recent_deployments": []  # Can be implemented later
    }
