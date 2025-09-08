from fastapi import APIRouter, BackgroundTasks
from sqlmodel import select
from backend.db import get_session
from backend.models import Fitting, Deployment, MLPrediction
from backend.utils import parse_uid, ZONE_DEFAULTS
from backend.ml_proxy import call_ml
from datetime import date, datetime

router = APIRouter(prefix="/api/worker")

@router.post("/scan")
async def scan(payload: dict, background_tasks: BackgroundTasks):
    uid = payload.get("uid")
    context = payload.get("context", "inventory")
    scanned_by = payload.get("scanned_by")
    deployment_info = payload.get("deployment") or {}

    s = get_session()
    stmt = select(Fitting).where(Fitting.uid == uid)
    f = s.exec(stmt).one_or_none()
    if not f:
        parts = parse_uid(uid)
        f = Fitting(uid=uid, manufacturer=None, component_type=None, zone_code=parts.get("zone"))
        s.add(f)
        s.commit()
        s.refresh(f)

    result = {"fitting": f}

    if context == "deploy":
        dep = Deployment(
            fitting_id = f.id,
            deployed_by = scanned_by,
            deployment_date = datetime.strptime(deployment_info.get("deployment_date"), "%Y-%m-%d").date() if deployment_info.get("deployment_date") else date.today(),
            line_id = deployment_info.get("line_id"),
            km_point = deployment_info.get("km_point"),
            installation_zone = deployment_info.get("installation_zone") or f.zone_code
        )
        zone = dep.installation_zone
        defaults = ZONE_DEFAULTS.get(zone, (10.0, "Straight"))
        dep.track_density_gmt = defaults[0]
        dep.track_curvature = defaults[1]
        s.add(dep)
        f.status = "deployed"
        f.installation_date = dep.deployment_date
        s.add(f)
        s.commit()
        s.refresh(f)

        payload_ml = {
            "Component_Type": f.component_type or "Unknown",
            "Manufacturer": f.manufacturer or "Unknown",
            "Official_Zone": f.zone_code or zone,
            "Installation_Zone": dep.installation_zone,
            "Traffic_Density_GMT": dep.track_density_gmt,
            "Track_Curvature": dep.track_curvature,
            "Maintenance_History": f.maintenance_history or "Average",
            "Installation_Year": dep.deployment_date.year,
            "Installation_Month": dep.deployment_date.month,
            "Warranty_Period_Years": f.warranty_period_years or 3,
            "Component_Age_Days": (dep.deployment_date - f.date_of_supply).days if f.date_of_supply else 0
        }

        async def run_ml_and_save():
            try:
                res = await call_ml(payload_ml)
                m = MLPrediction(
                    fitting_id = f.id,
                    predicted_remaining_lifespan_days = int(res.get("predicted_remaining_lifespan_days", 0)) if isinstance(res, dict) else None,
                    maintenance_priority = res.get("maintenance_priority") if isinstance(res, dict) else None,
                    next_maintenance_date = res.get("next_maintenance_date") if isinstance(res, dict) else None,
                    raw_response = res if isinstance(res, dict) else {}
                )
                s2 = get_session()
                s2.add(m)
                s2.commit()
            except Exception as e:
                print("ML error:", e)
        background_tasks.add_task(run_ml_and_save)

        result["deployment_id"] = dep.id
        result["msg"] = "deployed; ML processing scheduled"
    else:
        last = s.exec(select(MLPrediction).where(MLPrediction.fitting_id==f.id).order_by(MLPrediction.created_at.desc())).first()
        if last:
            result["ml_prediction"] = last

    return result
