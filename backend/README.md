# Railway Fitting Management System - Backend API

## Overview
FastAPI backend for managing railway fittings with UID tracking, vendor management, factory deployment, worker scanning, and ML integration for maintenance prediction.

## Tech Stack
- Python 3.10+
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite (local development)
- httpx for ML API calls
- pandas for CSV seeding

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   cd backend
   pip install -r requirements.txt
   \`\`\`

2. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Database Setup**
   \`\`\`bash
   python seed_db.py  # Seeds database from CSV file
   \`\`\`

4. **Run the Server**
   \`\`\`bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8001
   \`\`\`

## API Endpoints

### Vendor Panel
- `POST /vendor/create_component` - Create new component
- `GET /vendor/check_component?uid=...` - Check component existence

### Factory Manager
- `POST /factory/deploy_batch` - Deploy batch of components

### Worker Scanner
- `POST /scans/submit` - Submit scan data

### Admin
- `GET /admin/fittings_count` - Get total fittings count
- `GET /admin/urgent` - Get urgent maintenance items
- `GET /fittings/{uid}` - Get fitting details

### ML Integration
- Internal proxy to ML API at `http://127.0.0.1:8000/predict_maintenance`

## UID Schema
Format: `IR25-Z005-V012-B045-000123`
- IR25: Indian Railways, Year 2025
- Z005: Zone ID
- V012: Vendor ID
- B045: Batch number
- 000123: Serial number

## Database Models
- Fitting: Core component data
- Deployment: Installation records
- MLPrediction: AI maintenance predictions
- Worker: Worker information
- Vendor: Vendor details
- BatchCounter: Serial number allocation

## Environment Variables
- `ML_API_URL`: ML service endpoint (default: http://127.0.0.1:8000/predict_maintenance)
- `DATABASE_URL`: Database connection string
