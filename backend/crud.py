from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional
from datetime import date, datetime

from models import (
    Fitting, Vendor, Worker, Deployment, MLPrediction, 
    BatchCounter, Inspection, FittingStatus
)
from schemas import (
    FittingCreate, VendorCreate, DeploymentCreate, 
    MLPredictionCreate, WorkerScanSubmit
)
from utils import parse_uid, generate_uid, get_zone_defaults

# Vendor CRUD
def get_vendor(db: Session, vendor_code: str) -> Optional[Vendor]:
    return db.query(Vendor).filter(Vendor.vendor_code == vendor_code).first()

def create_vendor(db: Session, vendor: VendorCreate) -> Vendor:
    db_vendor = Vendor(**vendor.dict())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

def get_vendors(db: Session, skip: int = 0, limit: int = 100) -> List[Vendor]:
    return db.query(Vendor).offset(skip).limit(limit).all()

# Fitting CRUD
def get_fitting_by_uid(db: Session, uid: str) -> Optional[Fitting]:
    return db.query(Fitting).filter(Fitting.uid == uid).first()

def get_fitting(db: Session, fitting_id: int) -> Optional[Fitting]:
    return db.query(Fitting).filter(Fitting.id == fitting_id).first()

def create_fitting(db: Session, fitting: FittingCreate, uid: str = None) -> Fitting:
    if uid is None:
        # Generate UID
        uid = generate_uid(
            vendor_code=fitting.vendor_code,
            batch=fitting.batch,
            serial=get_next_serial(db, fitting.vendor_code, fitting.batch),
            zone_code=fitting.zone_code
        )
    
    # Parse UID to get serial number
    uid_parts = parse_uid(uid)
    serial = int(uid_parts['serial']) if uid_parts else 1
    
    db_fitting = Fitting(
        uid=uid,
        serial=serial,
        **fitting.dict()
    )
    db.add(db_fitting)
    db.commit()
    db.refresh(db_fitting)
    return db_fitting

def get_fittings(db: Session, skip: int = 0, limit: int = 100) -> List[Fitting]:
    return db.query(Fitting).offset(skip).limit(limit).all()

def get_fittings_count(db: Session) -> int:
    return db.query(Fitting).count()

def update_fitting_status(db: Session, fitting_id: int, status: FittingStatus, installation_date: date = None):
    fitting = db.query(Fitting).filter(Fitting.id == fitting_id).first()
    if fitting:
        fitting.status = status
        if installation_date:
            fitting.installation_date = installation_date
        fitting.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(fitting)
    return fitting

# Batch Counter CRUD
def get_next_serial(db: Session, vendor_code: str, batch: str) -> int:
    counter = db.query(BatchCounter).filter(
        BatchCounter.vendor_code == vendor_code,
        BatchCounter.batch == batch
    ).first()
    
    if not counter:
        counter = BatchCounter(vendor_code=vendor_code, batch=batch, last_serial=0)
        db.add(counter)
    
    counter.last_serial += 1
    counter.updated_at = datetime.utcnow()
    db.commit()
    return counter.last_serial

# Worker CRUD
def get_worker_by_code(db: Session, worker_code: str) -> Optional[Worker]:
    return db.query(Worker).filter(Worker.worker_code == worker_code).first()

def create_worker(db: Session, worker_code: str, name: str, depot_id: str = None) -> Worker:
    db_worker = Worker(
        worker_code=worker_code,
        name=name,
        depot_id=depot_id,
        role="field_worker"
    )
    db.add(db_worker)
    db.commit()
    db.refresh(db_worker)
    return db_worker

# Deployment CRUD
def create_deployment(db: Session, deployment: DeploymentCreate) -> Deployment:
    # Auto-fill track density and curvature if not provided
    if not deployment.track_density or not deployment.track_curvature:
        defaults = get_zone_defaults(deployment.installation_zone)
        if not deployment.track_density:
            deployment.track_density = defaults['traffic_density']
        if not deployment.track_curvature:
            deployment.track_curvature = defaults['track_curvature']
    
    db_deployment = Deployment(**deployment.dict())
    db.add(db_deployment)
    db.commit()
    db.refresh(db_deployment)
    return db_deployment

def get_deployments_by_fitting(db: Session, fitting_id: int) -> List[Deployment]:
    return db.query(Deployment).filter(Deployment.fitting_id == fitting_id).all()

# ML Prediction CRUD
def create_ml_prediction(db: Session, prediction: MLPredictionCreate) -> MLPrediction:
    db_prediction = MLPrediction(**prediction.dict())
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_latest_ml_prediction(db: Session, fitting_id: int) -> Optional[MLPrediction]:
    return db.query(MLPrediction).filter(
        MLPrediction.fitting_id == fitting_id
    ).order_by(desc(MLPrediction.created_at)).first()

def get_urgent_maintenance_items(db: Session) -> List[dict]:
    results = db.query(
        Fitting.uid,
        Fitting.component_type,
        MLPrediction.predicted_remaining_lifespan_days,
        MLPrediction.next_maintenance_date,
        Deployment.installation_zone,
        Deployment.deployment_date
    ).join(MLPrediction).outerjoin(Deployment).filter(
        MLPrediction.maintenance_priority == 'urgent'
    ).all()
    
    return [
        {
            "uid": result.uid,
            "component_type": result.component_type,
            "predicted_remaining_lifespan_days": result.predicted_remaining_lifespan_days,
            "next_maintenance_date": result.next_maintenance_date,
            "installation_zone": result.installation_zone,
            "deployment_date": result.deployment_date
        }
        for result in results
    ]

# Statistics
def get_maintenance_stats(db: Session) -> dict:
    urgent_count = db.query(MLPrediction).filter(
        MLPrediction.maintenance_priority == 'urgent'
    ).count()
    
    medium_count = db.query(MLPrediction).filter(
        MLPrediction.maintenance_priority == 'medium'
    ).count()
    
    basic_count = db.query(MLPrediction).filter(
        MLPrediction.maintenance_priority == 'basic'
    ).count()
    
    return {
        "urgent_maintenance": urgent_count,
        "medium_maintenance": medium_count,
        "basic_maintenance": basic_count
    }

def get_admin_stats(db: Session) -> dict:
    total_fittings = db.query(Fitting).count()
    deployed_fittings = db.query(Fitting).filter(
        Fitting.status == FittingStatus.DEPLOYED
    ).count()
    vendors_count = db.query(Vendor).count()
    
    maintenance_stats = get_maintenance_stats(db)
    
    return {
        "total_fittings": total_fittings,
        "deployed_fittings": deployed_fittings,
        "vendors_count": vendors_count,
        "zones_count": 18,  # Fixed number of railway zones
        **maintenance_stats
    }
