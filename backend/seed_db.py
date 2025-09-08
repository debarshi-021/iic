import pandas as pd
from sqlmodel import select
from backend.db import init_db, get_session
from backend.models import Fitting
from backend.utils import parse_uid
import os

def seed_from_excel(path="Final_railway_fittings_dataset.xlsx"):
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    df = pd.read_excel(path)
    inserted = 0
    updated = 0
    s = get_session()
    for _, row in df.iterrows():
        uid = str(row.get("Component_ID", "")).strip()
        if not uid:
            continue
        found = s.exec(select(Fitting).where(Fitting.uid==uid)).one_or_none()
        if found:
            f = found
            f.component_type = row.get("Component_Type", f.component_type)
            f.manufacturer = row.get("Manufacturer", f.manufacturer)
            try:
                f.date_of_supply = pd.to_datetime(row.get("Date_of_Supply", f.date_of_supply)).date()
            except:
                pass
            s.add(f)
            updated += 1
        else:
            obj = Fitting(
                uid=uid,
                component_type=row.get("Component_Type"),
                manufacturer=row.get("Manufacturer"),
                zone_code=row.get("Official_Zone"),
                installation_zone=row.get("Installation_Zone"),
                track_density_gmt=row.get("Traffic_Density_GMT") or 0.0,
                track_curvature=row.get("Track_Curvature"),
                maintenance_history=row.get("Maintenance_History"),
                date_of_supply=pd.to_datetime(row.get("Date_of_Supply", None)).date() if pd.notnull(row.get("Date_of_Supply", None)) else None,
                warranty_period_years=int(row.get("Warranty_Period_Years", 0)) if pd.notnull(row.get("Warranty_Period_Years", 0)) else None
            )
            s.add(obj)
            inserted += 1
    s.commit()
    print(f"Inserted: {inserted}, Updated: {updated}")

if __name__ == "__main__":
    init_db()
    seed_from_excel()
