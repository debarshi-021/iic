from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from db import create_tables, get_db
from api import vendor, factory, worker, admin
from crud import (
    get_fitting_by_uid, get_deployments_by_fitting,
    get_latest_ml_prediction, get_vendor
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(
    title="Railway Fitting Management System",
    description="API for managing railway fittings with UID tracking and ML predictions",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vendor.router, prefix="/vendor", tags=["vendor"])
app.include_router(factory.router, prefix="/factory", tags=["factory"])
app.include_router(worker.router, prefix="/scans", tags=["worker"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "Railway Fitting Management System API", "docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/fittings/{uid}")
async def get_fitting(uid: str, db=Depends(get_db)):
    fitting = get_fitting_by_uid(db, uid)
    if not fitting:
        raise HTTPException(status_code=404, detail=f"Fitting with UID {uid} not found")
    deployments = get_deployments_by_fitting(db, fitting.id)
    latest_ml_prediction = get_latest_ml_prediction(db, fitting.id)
    vendor_info = get_vendor(db, fitting.vendor_code)
    return {
        "fitting": fitting,
        "deployments": deployments,
        "latest_ml_prediction": latest_ml_prediction,
        "vendor_info": vendor_info,
    }


