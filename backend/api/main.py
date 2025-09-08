from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.worker import router as worker_router
from backend.api.admin import router as admin_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change for production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(worker_router)
app.include_router(admin_router)
