import pandas as pd
import os
from datetime import datetime, date
from sqlalchemy.orm import Session

from db import SessionLocal, create_tables
from models import Fitting, Vendor, BatchCounter, FittingStatus
from utils import VENDOR_MAP, parse_uid, generate_uid
from crud import create_vendor, get_vendor

def seed_vendors(db: Session):
    """Seed vendor data"""
    print("Seeding vendors...")
    for vendor_code, vendor_name in VENDOR_MAP.items():
        existing_vendor = get_vendor(db, vendor_code)
        if not existing_vendor:
            from schemas import VendorCreate
            vendor_data = VendorCreate(
                vendor_code=vendor_code,
                vendor_name=vendor_name
            )
            create_vendor(db, vendor_data)
            print(f"Created vendor: {vendor_code} - {vendor_name}")

def seed_from_excel(db: Session):
    """Seed database from Excel file in project root"""
    excel_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Final_railway_fittings_dataset.xlsx")
    if not os.path.exists(excel_path):
        print("Excel file not found. Creating sample data...")
        create_sample_data(db)
        return

    print(f"Reading Excel: {excel_path}")
    df = pd.read_excel(excel_path, engine="openpyxl")
    print(f"Excel rows: {len(df)}")

    inserted = 0
    skipped = 0
    processed = 0
    for index, row in df.iterrows():
        processed += 1
        try:
            uid = row.get('Component_ID')
            if not uid or not parse_uid(str(uid)):
                # fallback: synthesize uid
                uid = generate_uid("V001", "B001", index + 1, "Z005")

            uid = str(uid)
            parts = parse_uid(uid)
            if not parts:
                skipped += 1
                continue

            existing = db.query(Fitting).filter(Fitting.uid == uid).first()
            if existing:
                skipped += 1
                continue

            zone_code = parts['zone']
            vendor_code = parts['vendor']
            batch = parts['batch']
            serial = int(parts['serial'])

            fitting = Fitting(
                uid=uid,
                component_type=row.get('Component_Type', 'Unknown'),
                manufacturer=row.get('Manufacturer', 'Unknown'),
                zone_code=zone_code,
                vendor_code=vendor_code,
                batch=batch,
                serial=serial,
                track_density=row.get('Traffic_Density_GMT') if hasattr(Fitting, 'track_density') else None,
                date_of_supply=parse_date(row.get('Date_of_Supply')),
                installation_date=parse_date(row.get('Installation_Date')),
                warranty_period_years=int(row.get('Warranty_Period_Years', 5)),
                status=FittingStatus.MANUFACTURED,
            )

            db.add(fitting)
            update_batch_counter(db, vendor_code, batch, serial)
            if processed % 500 == 0:
                db.commit()
            inserted += 1
        except Exception as e:
            print(f"Row {index} error: {e}")
            skipped += 1

    db.commit()
    print(f"Processed: {processed}, Inserted: {inserted}, Skipped: {skipped}")

def parse_date(date_str):
    """Parse date string to date object"""
    if pd.isna(date_str) or not date_str:
        return date.today()
    
    try:
        # Try different date formats
        for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y', '%Y-%m-%d %H:%M:%S']:
            try:
                return datetime.strptime(str(date_str), fmt).date()
            except ValueError:
                continue
        return date.today()
    except:
        return date.today()

def update_batch_counter(db: Session, vendor_code: str, batch: str, serial: int):
    """Update batch counter with max serial"""
    counter = db.query(BatchCounter).filter(
        BatchCounter.vendor_code == vendor_code,
        BatchCounter.batch == batch
    ).first()
    
    if not counter:
        counter = BatchCounter(
            vendor_code=vendor_code,
            batch=batch,
            last_serial=serial
        )
        db.add(counter)
    else:
        if serial > counter.last_serial:
            counter.last_serial = serial
            counter.updated_at = datetime.utcnow()

def create_sample_data(db: Session):
    """Create sample data if no CSV found"""
    print("Creating sample data...")
    
    sample_fittings = []
    for i in range(100):  # Create 100 sample fittings
        vendor_code = f"V{(i % 8) + 1:03d}"
        batch = f"B{(i // 10) + 1:03d}"
        serial = (i % 10) + 1
        zone_code = f"Z{(i % 18) + 1:03d}"
        
        uid = generate_uid(vendor_code, batch, serial, zone_code)
        
        fitting = Fitting(
            uid=uid,
            component_type=["Elastic Rail Clips", "Liners", "Rail Pad", "Sleeper"][i % 4],
            manufacturer=VENDOR_MAP.get(vendor_code, "Unknown"),
            zone_code=zone_code,
            vendor_code=vendor_code,
            batch=batch,
            serial=serial,
            date_of_supply=date.today(),
            warranty_period_years=5,
            status=FittingStatus.MANUFACTURED
        )
        
        sample_fittings.append(fitting)
        update_batch_counter(db, vendor_code, batch, serial)
    
    db.add_all(sample_fittings)
    db.commit()
    print(f"Created {len(sample_fittings)} sample fittings")

def main():
    """Main seeding function"""
    print("Starting database seeding...")
    
    # Create tables
    create_tables()
    
    # Get database session
    db = SessionLocal()
    
    try:
        # Seed vendors first
        seed_vendors(db)
        
        # Seed fittings from Excel or create sample data
        seed_from_excel(db)
        
        print("Database seeding completed successfully!")
        
    except Exception as e:
        print(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
