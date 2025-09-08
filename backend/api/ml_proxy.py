from fastapi import APIRouter, HTTPException
import httpx
from datetime import datetime, timedelta
from typing import Optional

from config import settings
from schemas import MLAPIRequest, MLAPIResponse
from models import Fitting, Deployment
from utils import get_zone_name

router = APIRouter()

async def call_ml_api(fitting: Fitting, deployment: Deployment) -> Optional[MLAPIResponse]:
    """
    Call external ML API for maintenance prediction
    """
    try:
        # Calculate component age
        installation_date = deployment.deployment_date
        current_date = datetime.now().date()
        component_age_days = (current_date - installation_date).days
        
        # Prepare ML API request
        ml_request = MLAPIRequest(
            Component_Type=fitting.component_type,
            Manufacturer=fitting.manufacturer,
            Official_Zone=get_zone_name(fitting.zone_code),
            Installation_Zone=get_zone_name(deployment.installation_zone),
            Traffic_Density_GMT=deployment.track_density,
            Track_Curvature=deployment.track_curvature,
            Maintenance_History="Good",  # Default value
            Installation_Year=installation_date.year,
            Installation_Month=installation_date.month,
            Warranty_Period_Years=fitting.warranty_period_years,
            Component_Age_Days=component_age_days
        )
        
        # Make HTTP request to ML API with simple retries
        async with httpx.AsyncClient(timeout=15.0) as client:
            last_error = None
            for attempt in range(3):
                try:
                    response = await client.post(
                        settings.ml_api_url,
                        json=ml_request.model_dump()
                    )
                    if response.status_code == 200:
                        ml_data = response.json()
                        return MLAPIResponse(**ml_data)
                    elif response.status_code == 422:
                        # Validation error from ML; do not retry
                        print(f"ML API validation error: {response.text}")
                        return None
                    else:
                        last_error = f"{response.status_code}: {response.text}"
                except httpx.HTTPError as e:
                    last_error = str(e)
                
            print(f"ML API error after retries: {last_error}")
            return None
                
    except httpx.TimeoutException:
        print("ML API timeout")
        return None
    except Exception as e:
        print(f"ML API call failed: {e}")
        return None

@router.post("/predict", response_model=MLAPIResponse)
async def predict_maintenance(request: MLAPIRequest):
    """
    Direct ML prediction endpoint (proxy to external ML service)
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                settings.ml_api_url,
                json=request.dict()
            )
            
            if response.status_code == 200:
                return MLAPIResponse(**response.json())
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"ML API error: {response.text}"
                )
                
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="ML API timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML prediction failed: {str(e)}")

@router.get("/health")
async def check_ml_api_health():
    """
    Check if ML API is available
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{settings.ml_api_url.replace('/predict_maintenance', '/health')}")
            return {
                "ml_api_status": "healthy" if response.status_code == 200 else "unhealthy",
                "ml_api_url": settings.ml_api_url
            }
    except Exception as e:
        return {
            "ml_api_status": "unreachable",
            "ml_api_url": settings.ml_api_url,
            "error": str(e)
        }
