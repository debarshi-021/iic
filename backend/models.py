from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Enum, Date, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class FittingStatus(enum.Enum):
    MANUFACTURED = "manufactured"
    IN_DEPOT = "in_depot"
    DEPLOYED = "deployed"
    MAINTENANCE = "maintenance"
    RETIRED = "retired"

class MaintenancePriority(enum.Enum):
    URGENT = "urgent"
    MEDIUM = "medium"
    BASIC = "basic"

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(Integer, primary_key=True, index=True)
    vendor_code = Column(String(4), unique=True, index=True)  # V001, V002, etc.
    vendor_name = Column(String(100), nullable=False)
    contact_email = Column(String(100))
    contact_phone = Column(String(20))
    address = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    fittings = relationship("Fitting", back_populates="vendor")

class Worker(Base):
    __tablename__ = "workers"
    
    id = Column(Integer, primary_key=True, index=True)
    worker_code = Column(String(20), unique=True, index=True)
    name = Column(String(100), nullable=False)
    depot_id = Column(String(20))
    role = Column(String(50))
    device_id = Column(String(50))
    last_online = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    deployments = relationship("Deployment", back_populates="worker")

class Fitting(Base):
    __tablename__ = "fittings"
    
    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String(50), unique=True, index=True)  # IR25-Z005-V012-B045-000123
    component_type = Column(String(100), nullable=False)
    manufacturer = Column(String(100), nullable=False)
    zone_code = Column(String(4), nullable=False)  # Z005
    vendor_code = Column(String(4), ForeignKey("vendors.vendor_code"), nullable=False)
    batch = Column(String(4), nullable=False)  # B045
    serial = Column(Integer, nullable=False)
    date_of_supply = Column(Date, nullable=False)
    installation_date = Column(Date, nullable=True)
    warranty_period_years = Column(Integer, nullable=False)
    status = Column(Enum(FittingStatus), default=FittingStatus.MANUFACTURED)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    vendor = relationship("Vendor", back_populates="fittings")
    deployments = relationship("Deployment", back_populates="fitting")
    ml_predictions = relationship("MLPrediction", back_populates="fitting")
    inspections = relationship("Inspection", back_populates="fitting")

class Deployment(Base):
    __tablename__ = "deployments"
    
    id = Column(Integer, primary_key=True, index=True)
    fitting_id = Column(Integer, ForeignKey("fittings.id"), nullable=False)
    deployed_by = Column(Integer, ForeignKey("workers.id"), nullable=False)
    deployment_date = Column(Date, nullable=False)
    line_id = Column(String(50))
    km_point = Column(Float)
    installation_zone = Column(String(4), nullable=False)
    track_density = Column(Float, nullable=False)  # GMT (Gross Million Tonnes)
    track_curvature = Column(String(20), nullable=False)  # Straight, Moderate, Sharp
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    fitting = relationship("Fitting", back_populates="deployments")
    worker = relationship("Worker", back_populates="deployments")

class MLPrediction(Base):
    __tablename__ = "ml_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    fitting_id = Column(Integer, ForeignKey("fittings.id"), nullable=False)
    predicted_remaining_lifespan_days = Column(Integer, nullable=False)
    maintenance_priority = Column(String(20), nullable=False)
    next_maintenance_date = Column(Date, nullable=False)
    confidence = Column(Float)  # 0.0 to 1.0
    model_version = Column(String(20))
    raw_response = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    fitting = relationship("Fitting", back_populates="ml_predictions")

class BatchCounter(Base):
    __tablename__ = "batch_counters"
    
    id = Column(Integer, primary_key=True, index=True)
    vendor_code = Column(String(4), nullable=False)
    batch = Column(String(4), nullable=False)
    last_serial = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Inspection(Base):
    __tablename__ = "inspections"
    
    id = Column(Integer, primary_key=True, index=True)
    fitting_id = Column(Integer, ForeignKey("fittings.id"), nullable=False)
    inspector_id = Column(Integer, ForeignKey("workers.id"))
    inspection_date = Column(Date, nullable=False)
    inspection_type = Column(String(50))  # routine, emergency, scheduled
    findings = Column(Text)
    condition_rating = Column(Integer)  # 1-10 scale
    action_required = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    fitting = relationship("Fitting", back_populates="inspections")
    inspector = relationship("Worker")
