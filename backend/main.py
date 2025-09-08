from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from db import create_tables
from api import vendor, factory, worker, admin, ml_proxy
from config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Railway Fitting Management System",
    description="API for managing railway fittings with UID tracking and ML predictions",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(vendor.router, prefix="/vendor", tags=["vendor"])
app.include_router(factory.router, prefix="/factory", tags=["factory"])
app.include_router(worker.router, prefix="/scans", tags=["worker"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(ml_proxy.router, prefix="/ml", tags=["ml"])

@app.get("/")
async def root():
    return {
        "message": "Railway Fitting Management System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )
