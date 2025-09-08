from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date, datetime
from sqlalchemy import Column, JSON

class Fitting(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uid: str = Field(index=True, unique=True)
    component_type: Optional[str]
    manufacturer: Optional[str]
    zone_code: Optional[str]
    installation_zone: Optional[str]
    track_density_gmt: Optional[float] = 0.0
    track_curvature: Optional[str]
    maintenance_history: Optional[str]
    installation_date: Optional[date]
    date_of_supply: Optional[date]
    warranty_period_years: Optional[int]
    status: Optional[str] = "manufactured"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Deployment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fitting_id: int = Field(foreign_key="fitting.id")
    deployed_by: Optional[str]
    deployment_date: Optional[date]
    line_id: Optional[str]
    km_point: Optional[float]
    installation_zone: Optional[str]
    track_density_gmt: Optional[float]
    track_curvature: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MLPrediction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fitting_id: int = Field(foreign_key="fitting.id")
    predicted_remaining_lifespan_days: Optional[int]
    maintenance_priority: Optional[str]
    next_maintenance_date: Optional[date]
    raw_response: Optional[dict] = Field(sa_column=Column(JSON), default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
