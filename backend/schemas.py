from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum

# Enums
class FittingStatusEnum(str, Enum):
    MANUFACTURED = "manufactured"
    IN_DEPOT = "in_depot"
    DEPLOYED = "deployed"
    MAINTENANCE = "maintenance"
    RETIRED = "retired"

class MaintenancePriorityEnum(str, Enum):
    URGENT = "urgent"
    MEDIUM = "medium"
    BASIC = "basic"

class ScanContextEnum(str, Enum):
    ISSUE = "issue"
    INVENTORY = "inventory"
    DEPLOY = "deploy"
    INSPECT = "inspect"

# Base schemas
class VendorBase(BaseModel):
    vendor_code: str = Field(..., pattern=r'^V\d{3}$')
    vendor_name: str
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class Vendor(VendorBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Fitting schemas
class FittingBase(BaseModel):
    component_type: str
    manufacturer: str
    zone_code: str = Field(..., pattern=r'^Z\d{3}$')
    vendor_code: str = Field(..., pattern=r'^V\d{3}$')
    batch: str = Field(..., pattern=r'^B\d{3}$')
    date_of_supply: date
    warranty_period_years: int = Field(..., ge=1, le=50)

class FittingCreate(FittingBase):
    uid: Optional[str] = None  # Auto-generated if not provided

class FittingUpdate(BaseModel):
    installation_date: Optional[date] = None
    status: Optional[FittingStatusEnum] = None

class Fitting(FittingBase):
    id: int
    uid: str
    serial: int
    installation_date: Optional[date] = None
    status: FittingStatusEnum
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Vendor component creation request
class VendorComponentCreate(BaseModel):
    component_type: str
    manufacturer: str
    official_zone: str  # Can be zone name or code
    installation_zone: Optional[str] = None
    batch: Optional[str] = None  # Auto-assigned if not provided
    warranty_period_years: int = Field(default=5, ge=1, le=50)
    date_of_supply: date

class VendorComponentResponse(BaseModel):
    success: bool
    message: str
    fitting: Optional[Fitting] = None
    uid: Optional[str] = None

# Deployment schemas
class DeploymentInfo(BaseModel):
    line_id: Optional[str] = None
    km_point: Optional[float] = None
    installation_zone: str

class DeploymentCreate(BaseModel):
    fitting_id: int
    deployed_by: int
    deployment_date: date
    line_id: Optional[str] = None
    km_point: Optional[float] = None
    installation_zone: str
    track_density: Optional[float] = None  # Auto-filled if not provided
    track_curvature: Optional[str] = None  # Auto-filled if not provided

class Deployment(BaseModel):
    id: int
    fitting_id: int
    deployed_by: int
    deployment_date: date
    line_id: Optional[str] = None
    km_point: Optional[float] = None
    installation_zone: str
    track_density: float
    track_curvature: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Factory deployment request
class FactoryDeployBatch(BaseModel):
    uids: List[str]
    deployment_date: date
    installation_zone: str
    line_id: Optional[str] = None
    km_start: Optional[float] = None
    km_end: Optional[float] = None

class FactoryDeployResponse(BaseModel):
    success: bool
    message: str
    deployed_count: int
    failed_uids: List[str]
    ml_predictions: List[dict]

# Frontend compatibility deploy schema (no UI change)
class FactoryDeployCompat(BaseModel):
    batch_id: str
    zone_code: str
    line_id: str
    km_start: float
    km_end: float
    priority: str
    deployment_date: Optional[date] = None

# ML Prediction schemas
class MLPredictionCreate(BaseModel):
    fitting_id: int
    predicted_remaining_lifespan_days: int
    maintenance_priority: MaintenancePriorityEnum
    next_maintenance_date: date
    confidence: Optional[float] = None
    model_version: Optional[str] = None
    raw_response: Optional[dict] = None

class MLPrediction(BaseModel):
    id: int
    fitting_id: int
    predicted_remaining_lifespan_days: int
    maintenance_priority: MaintenancePriorityEnum
    next_maintenance_date: date
    confidence: Optional[float] = None
    model_version: Optional[str] = None
    raw_response: Optional[dict] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Worker scan schemas
class WorkerScanSubmit(BaseModel):
    uid: str
    scanned_by: str
    context: ScanContextEnum
    deployment: Optional[DeploymentInfo] = None

class WorkerScanResponse(BaseModel):
    success: bool
    message: str
    fitting: Optional[Fitting] = None
    ml_prediction: Optional[MLPrediction] = None
    is_new_fitting: bool = False

# ML API schemas (for external ML service)
class MLAPIRequest(BaseModel):
    Component_Type: str
    Manufacturer: str
    Official_Zone: str
    Installation_Zone: str
    Traffic_Density_GMT: float
    Track_Curvature: str
    Maintenance_History: str = "Good"
    Installation_Year: int
    Installation_Month: int
    Warranty_Period_Years: int
    Component_Age_Days: int

class MLAPIResponse(BaseModel):
    predicted_remaining_lifespan_days: int
    maintenance_priority: str
    next_maintenance_date: str
    confidence: Optional[float] = None
    model_version: Optional[str] = None

# Admin schemas
class AdminStats(BaseModel):
    total_fittings: int
    deployed_fittings: int
    urgent_maintenance: int
    medium_maintenance: int
    basic_maintenance: int
    vendors_count: int
    zones_count: int

class UrgentMaintenanceItem(BaseModel):
    uid: str
    component_type: str
    installation_zone: str
    predicted_remaining_lifespan_days: int
    next_maintenance_date: date
    deployment_date: Optional[date] = None

# Detailed fitting response
class FittingDetail(BaseModel):
    fitting: Fitting
    deployments: List[Deployment]
    latest_ml_prediction: Optional[MLPrediction] = None
    vendor_info: Vendor
