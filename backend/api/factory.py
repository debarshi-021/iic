from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import asyncio

from db import get_db
from schemas import (
    FactoryDeployBatch, FactoryDeployResponse,
    DeploymentCreate, MLPredictionCreate
)
from crud import (
    get_fitting_by_uid, create_fitting, create_deployment,
    create_ml_prediction, get_worker_by_code, create_worker,
    update_fitting_status
)
from utils import parse_uid, get_zone_defaults, normalize_zone_input
from models import FittingStatus
from .ml_proxy import call_ml_api

router = APIRouter()

@router.post("/deploy_batch", response_model=FactoryDeployResponse)
async def deploy_batch(
    deploy_data: FactoryDeployBatch,
    db: Session = Depends(get_db)
):
    """
    Deploy a batch of components
    """
    try:
        deployed_count = 0
        failed_uids = []
        ml_predictions = []
        
        # Ensure factory manager worker exists
        factory_worker = get_worker_by_code(db, "factory_manager")
        if not factory_worker:
            factory_worker = create_worker(
                db, "factory_manager", "Factory Manager", "CENTRAL_DEPOT"
            )
        
        installation_zone = normalize_zone_input(deploy_data.installation_zone)
        zone_defaults = get_zone_defaults(installation_zone)
        
        async def process_one(uid: str):
            try:
                # Get or create fitting
                fitting = get_fitting_by_uid(db, uid)
                if not fitting:
                    # Parse UID and create minimal fitting
                    uid_parts = parse_uid(uid)
                    if not uid_parts:
                        failed_uids.append(uid)
                        return None, None
                    
                    from schemas import FittingCreate
                    fitting_data = FittingCreate(
                        component_type="Unknown",
                        manufacturer="Unknown",
                        zone_code=uid_parts['zone'],
                        vendor_code=uid_parts['vendor'],
                        batch=uid_parts['batch'],
                        date_of_supply=deploy_data.deployment_date,
                        warranty_period_years=5
                    )
                    fitting = create_fitting(db, fitting_data, uid)
                
                # Create deployment
                km_point = None
                if deploy_data.km_start is not None and deploy_data.km_end is not None:
                    # Distribute components evenly across the km range
                    total_components = len(deploy_data.uids)
                    current_index = deploy_data.uids.index(uid)
                    km_range = deploy_data.km_end - deploy_data.km_start
                    km_point = deploy_data.km_start + (km_range * current_index / max(1, total_components - 1))
                
                deployment_data = DeploymentCreate(
                    fitting_id=fitting.id,
                    deployed_by=factory_worker.id,
                    deployment_date=deploy_data.deployment_date,
                    line_id=deploy_data.line_id,
                    km_point=km_point,
                    installation_zone=installation_zone,
                    track_density=zone_defaults['traffic_density'],
                    track_curvature=zone_defaults['track_curvature']
                )
                
                deployment = create_deployment(db, deployment_data)
                
                # Update fitting status
                update_fitting_status(
                    db, fitting.id, FittingStatus.DEPLOYED, deploy_data.deployment_date
                )
                
                # Call ML API for prediction (performed later depending on batch size)
                return fitting, deployment
            except Exception as e:
                print(f"Failed to deploy {uid}: {e}")
                failed_uids.append(uid)
                return None, None

        # Process deployments sequentially for DB writes
        results = []
        for uid in deploy_data.uids:
            fitting, deployment = await process_one(uid)
            if fitting and deployment:
                results.append((uid, fitting, deployment))
                deployed_count += 1

        async def ml_task(uid, fitting, deployment):
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
                    create_ml_prediction(db, ml_prediction_data)
                    ml_predictions.append({
                        "uid": uid,
                        "priority": ml_result.maintenance_priority,
                        "remaining_days": ml_result.predicted_remaining_lifespan_days,
                    })
            except Exception as ml_error:
                print(f"ML prediction failed for {uid}: {ml_error}")

        # Decide sync vs concurrent ML
        if len(results) <= 20:
            for uid, fitting, deployment in results:
                await ml_task(uid, fitting, deployment)
        else:
            await asyncio.gather(*(ml_task(uid, fitting, deployment) for uid, fitting, deployment in results))

        return FactoryDeployResponse(
            success=True,
            message=f"Deployed {deployed_count} components successfully",
            deployed_count=deployed_count,
            failed_uids=failed_uids,
            ml_predictions=ml_predictions
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Batch deployment failed: {str(e)}"
        )

@router.get("/deployments")
async def get_deployments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all deployments
    """
    from models import Deployment
    deployments = db.query(Deployment).offset(skip).limit(limit).all()
    return deployments
