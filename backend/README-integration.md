# Backend Integration Guide

## Setup

1) Create venv and install dependencies
```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
```

2) Configure environment
```bash
# create .env (optional)
# If omitted, defaults are used
# ML_API_URL and DB_URL are supported
```

3) Seed the database from Excel
```bash
python seed_db.py
```

4) Run the API server on port 5000
```bash
uvicorn backend.api.main:app --reload --port 5000
```

## Example curl commands

1) Worker scan (deploy context with ML)
```bash
curl -X POST http://127.0.0.1:5000/scans/submit \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "IR25-Z005-V001-B001-000101",
    "scanned_by": "worker_001",
    "context": "deploy",
    "deployment": {"installation_zone": "Z005", "line_id": "L1", "km_point": 12.3}
  }'
```

2) Factory deploy batch
```bash
curl -X POST http://127.0.0.1:5000/factory/deploy_batch \
  -H "Content-Type: application/json" \
  -d '{
    "uids": ["IR25-Z005-V001-B001-000201","IR25-Z005-V001-B001-000202","IR25-Z005-V001-B001-000203"],
    "deployment_date": "2024-01-15",
    "installation_zone": "Z005",
    "line_id": "L1",
    "km_start": 10,
    "km_end": 20
  }'
```

3) Health check
```bash
curl http://127.0.0.1:5000/health
```

## Notes
- ML API URL is expected at ML_API_URL (default `http://127.0.0.1:8000/predict_maintenance`).
- Excel file `Final_railway_fittings_dataset.xlsx` should be in the project root.
- Do not modify frontend files. If a frontend URL needs change, see `backend/frontend-proxy-notes.txt`.

## Troubleshooting
- SQLite locked: stop other processes or delete `railway.db` while server is stopped.
- ML API 422/timeout: endpoints still succeed without prediction; check FastAPI service under `FastAPI/`.

