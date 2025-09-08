from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db import get_db
from schemas import (
    VendorComponentCreate, VendorComponentResponse, 
    Fitting, FittingCreate
)
from crud import (
    get_fitting_by_uid, create_fitting, get_vendor, 
    create_vendor, get_next_serial
)
from utils import (
    normalize_zone_input, normalize_vendor_input, 
    validate_component_type, generate_uid, VENDOR_MAP
)
from schemas import VendorCreate as VendorCreateSchema

router = APIRouter()

@router.post("/create_component", response_model=VendorComponentResponse)
async def create_component(
    component_data: VendorComponentCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new component for a vendor
    """
    try:
        # Normalize inputs
        zone_code = normalize_zone_input(component_data.official_zone)
        component_type = validate_component_type(component_data.component_type)
        
        # Get vendor code from manufacturer name
        vendor_code = None
        for code, name in VENDOR_MAP.items():
            if component_data.manufacturer.lower() in name.lower():
                vendor_code = code
                break
        
        if not vendor_code:
            raise HTTPException(
                status_code=400,
                detail=f"Manufacturer '{component_data.manufacturer}' not found in vendor list"
            )
        
        # Ensure vendor exists in database
        vendor = get_vendor(db, vendor_code)
        if not vendor:
            vendor_create = VendorCreateSchema(
                vendor_code=vendor_code,
                vendor_name=VENDOR_MAP[vendor_code]
            )
            vendor = create_vendor(db, vendor_create)
        
        # Auto-assign batch if not provided
        batch = component_data.batch or "B001"
        
        # Generate UID
        serial = get_next_serial(db, vendor_code, batch)
        uid = generate_uid(vendor_code, batch, serial, zone_code)
        
        # Check if UID already exists
        existing_fitting = get_fitting_by_uid(db, uid)
        if existing_fitting:
            raise HTTPException(
                status_code=409,
                detail=f"Component with UID {uid} already exists"
            )
        
        # Create fitting
        fitting_data = FittingCreate(
            component_type=component_type,
            manufacturer=component_data.manufacturer,
            zone_code=zone_code,
            vendor_code=vendor_code,
            batch=batch,
            date_of_supply=component_data.date_of_supply,
            warranty_period_years=component_data.warranty_period_years
        )
        
        fitting = create_fitting(db, fitting_data, uid)
        
        return VendorComponentResponse(
            success=True,
            message=f"Component created successfully with UID: {uid}",
            fitting=fitting,
            uid=uid
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create component: {str(e)}"
        )

@router.get("/check_component")
async def check_component(uid: str, db: Session = Depends(get_db)):
    """
    Check if a component exists by UID
    """
    fitting = get_fitting_by_uid(db, uid)
    if not fitting:
        raise HTTPException(
            status_code=404,
            detail=f"Component with UID {uid} not found"
        )
    
    return {
        "exists": True,
        "fitting": fitting,
        "message": f"Component {uid} found"
    }

@router.get("/components", response_model=List[Fitting])
async def get_vendor_components(
    vendor_code: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all components for a specific vendor
    """
    from crud import get_fittings
    fittings = db.query(models.Fitting).filter(
        models.Fitting.vendor_code == vendor_code
    ).offset(skip).limit(limit).all()
    
    return fittings
