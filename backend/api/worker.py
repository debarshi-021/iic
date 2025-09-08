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
    create_ml_prediction, update_fitting_status
)
from utils import parse_uid, get_zone_defaults, normalize_zone_input
from models import FittingStatus
from .ml_proxy import call_ml_api

router = APIRouter()

async def _process_scan(scan_data: WorkerScanSubmit, db: Session) -> WorkerScanResponse:
    is_new_fitting = False

    worker = get_worker_by_code(db, scan_data.scanned_by)
    if not worker:
        worker = create_worker(db, scan_data.scanned_by, f"Worker {scan_data.scanned_by}")

    fitting = get_fitting_by_uid(db, scan_data.uid)
    if not fitting:
        uid_parts = parse_uid(scan_data.uid)
        if not uid_parts:
            raise HTTPException(status_code=400, detail=f"Invalid UID format: {scan_data.uid}")
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
    context_value = str(scan_data.context).lower()
    if context_value == "deploy" and scan_data.deployment:
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
    elif context_value in ["inventory", "inspect"]:
        ml_prediction = get_latest_ml_prediction(db, fitting.id)
        if context_value == "inspect" and not ml_prediction:
            from models import Deployment
            latest_deployment = db.query(Deployment).filter(
                Deployment.fitting_id == fitting.id
            ).order_by(Deployment.created_at.desc()).first()
            if latest_deployment:
                try:
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
                except Exception as e:
                    print(f"ML prediction failed during inspection: {e}")

    return WorkerScanResponse(
        success=True,
        message=f"Scan processed successfully for {context_value}",
        fitting=fitting,
        ml_prediction=ml_prediction,
        is_new_fitting=is_new_fitting
    )

@router.post("/submit", response_model=WorkerScanResponse)
async def submit_scan(scan_data: WorkerScanSubmit, db: Session = Depends(get_db)):
    return await _process_scan(scan_data, db)

# Compatibility alias if some clients call /scan
@router.post("/scan", response_model=WorkerScanResponse)
async def scan_alias(scan_data: WorkerScanSubmit, db: Session = Depends(get_db)):
    return await _process_scan(scan_data, db)
