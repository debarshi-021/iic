from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from db import get_db
from schemas import (
    WorkerScanSubmit, WorkerScanResponse,
    DeploymentCreate, MLPredictionCreate
)
from crud import (
    get_fitting_by_uid, create_fitting, get_worker_by_code,
    create_worker, create_deployment, get_latest_ml_prediction,
    create_ml_prediction, update_fitting_status, get_fittings_count
)
from utils import parse_uid, get_zone_defaults, normalize_zone_input
from models import FittingStatus
from .ml_proxy import call_ml_api

router = APIRouter()

@router.post("/submit", response_model=WorkerScanResponse)
async def submit_scan(
    scan_data: WorkerScanSubmit,
    db: Session = Depends(get_db)
):
    """
    Submit a worker scan
    """
    try:
        is_new_fitting = False
        
        # Get or create worker
        worker = get_worker_by_code(db, scan_data.scanned_by)
        if not worker:
            worker = create_worker(db, scan_data.scanned_by, f"Worker {scan_data.scanned_by}")
        
        # Get or create fitting
        fitting = get_fitting_by_uid(db, scan_data.uid)
        if not fitting:
            # Create new fitting (simulate dataset growth 50000 -> 50001)
            uid_parts = parse_uid(scan_data.uid)
            if not uid_parts:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid UID format: {scan_data.uid}"
                )
            
            from schemas import FittingCreate
            fitting_data = FittingCreate(
                component_type="Field Scanned Component",
                manufacturer="Unknown",
                zone_code=uid_parts['zone'],
                vendor_code=uid_parts['vendor'],
                batch=uid_parts['batch'],
                date_of_supply=datetime.now().date(),
                warranty_period_years=5
            )
            fitting = create_fitting(db, fitting_data, scan_data.uid)
            is_new_fitting = True
        
        ml_prediction = None
        
        # Handle different scan contexts
        if scan_data.context == "deploy" and scan_data.deployment:
            # Create deployment
            installation_zone = normalize_zone_input(scan_data.deployment.installation_zone)
            zone_defaults = get_zone_defaults(installation_zone)
            
            deployment_data = DeploymentCreate(
                fitting_id=fitting.id,
                deployed_by=worker.id,
                deployment_date=datetime.now().date(),
                line_id=scan_data.deployment.line_id,
                km_point=scan_data.deployment.km_point,
                installation_zone=installation_zone,
                track_density=zone_defaults['traffic_density'],
                track_curvature=zone_defaults['track_curvature']
            )
            
            deployment = create_deployment(db, deployment_data)
            update_fitting_status(db, fitting.id, FittingStatus.DEPLOYED, datetime.now().date())
            
            # Call ML API for prediction
            try:
                ml_result = await call_ml_api(fitting, deployment)
                if ml_result:
                    ml_prediction_data = MLPredictionCreate(
                        fitting_id=fitting.id,
                        predicted_remaining_lifespan_days=ml_result.predicted_remaining_lifespan_days,
                        maintenance_priority=ml_result.maintenance_priority,
                        next_maintenance_date=datetime.strptime(
                            ml_result.next_maintenance_date, "%Y-%m-%d"
                        ).date(),
                        confidence=ml_result.confidence,
                        model_version=ml_result.model_version,
                        raw_response=ml_result.model_dump() if hasattr(ml_result, 'model_dump') else None,
                    )
                    ml_prediction = create_ml_prediction(db, ml_prediction_data)
            except Exception as ml_error:
                print(f"ML prediction failed: {ml_error}")
        
        elif scan_data.context in ["inventory", "inspect"]:
            # Get latest ML prediction if exists
            ml_prediction = get_latest_ml_prediction(db, fitting.id)
            
            if scan_data.context == "inspect" and not ml_prediction:
                # Create inspection and try to get ML prediction
                try:
                    # For inspection without deployment, use default values
                    from models import Deployment
                    latest_deployment = db.query(Deployment).filter(
                        Deployment.fitting_id == fitting.id
                    ).order_by(Deployment.created_at.desc()).first()
                    
                    if latest_deployment:
                        ml_result = await call_ml_api(fitting, latest_deployment)
                        if ml_result:
                            ml_prediction_data = MLPredictionCreate(
                                fitting_id=fitting.id,
                                predicted_remaining_lifespan_days=ml_result.predicted_remaining_lifespan_days,
                                maintenance_priority=ml_result.maintenance_priority,
                                next_maintenance_date=datetime.strptime(
                                    ml_result.next_maintenance_date, "%Y-%m-%d"
                                ).date(),
                                confidence=ml_result.confidence,
                                model_version=ml_result.model_version,
                                raw_response=ml_result.model_dump() if hasattr(ml_result, 'model_dump') else None,
                            )
                            ml_prediction = create_ml_prediction(db, ml_prediction_data)
                except Exception as ml_error:
                    print(f"ML prediction failed during inspection: {ml_error}")
        
        return WorkerScanResponse(
            success=True,
            message=f"Scan processed successfully for {scan_data.context}",
            fitting=fitting,
            ml_prediction=ml_prediction,
            is_new_fitting=is_new_fitting
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Scan processing failed: {str(e)}"
        )

@router.get("/worker/{worker_code}/scans")
async def get_worker_scans(
    worker_code: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get scans by worker
    """
    worker = get_worker_by_code(db, worker_code)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    from models import Deployment
    deployments = db.query(Deployment).filter(
        Deployment.deployed_by == worker.id
    ).offset(skip).limit(limit).all()
    
    return deployments
