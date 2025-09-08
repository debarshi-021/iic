import re
from typing import Dict, Optional, Tuple
from datetime import datetime

# Vendor mapping from user requirements
VENDOR_MAP = {
    'V001': 'Rahee Track Technologies',
    'V002': 'Raymond Steel', 
    'V003': 'Eastern Track Udyog',
    'V004': 'Royal Infraconstru Ltd.',
    'V005': 'Pooja Industries',
    'V006': 'Jekay International',
    'V007': 'Avantika Concrete',
    'V008': 'Gammon India'
}

# Zone mapping (18 railway zones)
ZONE_MAP = {
    'Z001': 'Central Railway (CR)',
    'Z002': 'Eastern Railway (ER)', 
    'Z003': 'Northern Railway (NR)',
    'Z004': 'North Eastern Railway (NER)',
    'Z005': 'Northeast Frontier Railway (NFR)',
    'Z006': 'Southern Railway (SR)',
    'Z007': 'South Central Railway (SCR)',
    'Z008': 'South Eastern Railway (SER)',
    'Z009': 'Western Railway (WR)',
    'Z010': 'South Western Railway (SWR)',
    'Z011': 'North Western Railway (NWR)',
    'Z012': 'West Central Railway (WCR)',
    'Z013': 'East Central Railway (ECR)',
    'Z014': 'East Coast Railway (ECoR)',
    'Z015': 'North Central Railway (NCR)',
    'Z016': 'South East Central Railway (SECR)',
    'Z017': 'Kolkata Metro Railway (KMRC)',
    'Z018': 'Delhi Metro Rail Corporation (DMRC)'
}

# Default track density and curvature mapping by zone
ZONE_DEFAULTS = {
    'Z001': {'traffic_density': 25.0, 'track_curvature': 'Moderate'},  # Central Railway
    'Z002': {'traffic_density': 22.0, 'track_curvature': 'Straight'},  # Eastern Railway
    'Z003': {'traffic_density': 30.0, 'track_curvature': 'Straight'},  # Northern Railway
    'Z004': {'traffic_density': 18.0, 'track_curvature': 'Sharp'},     # North Eastern
    'Z005': {'traffic_density': 15.0, 'track_curvature': 'Sharp'},     # Northeast Frontier
    'Z006': {'traffic_density': 28.0, 'track_curvature': 'Moderate'},  # Southern Railway
    'Z007': {'traffic_density': 24.0, 'track_curvature': 'Moderate'},  # South Central
    'Z008': {'traffic_density': 20.0, 'track_curvature': 'Moderate'},  # South Eastern
    'Z009': {'traffic_density': 32.0, 'track_curvature': 'Straight'},  # Western Railway
    'Z010': {'traffic_density': 19.0, 'track_curvature': 'Moderate'},  # South Western
    'Z011': {'traffic_density': 16.0, 'track_curvature': 'Sharp'},     # North Western
    'Z012': {'traffic_density': 21.0, 'track_curvature': 'Moderate'},  # West Central
    'Z013': {'traffic_density': 23.0, 'track_curvature': 'Straight'},  # East Central
    'Z014': {'traffic_density': 26.0, 'track_curvature': 'Moderate'},  # East Coast
    'Z015': {'traffic_density': 27.0, 'track_curvature': 'Straight'},  # North Central
    'Z016': {'traffic_density': 17.0, 'track_curvature': 'Sharp'},     # South East Central
    'Z017': {'traffic_density': 35.0, 'track_curvature': 'Straight'},  # Kolkata Metro
    'Z018': {'traffic_density': 40.0, 'track_curvature': 'Straight'},  # Delhi Metro
}

def parse_uid(uid: str) -> Optional[Dict[str, str]]:
    """
    Parse UID format: IR25-Z005-V012-B045-000123
    Returns dict with year, zone, vendor, batch, serial
    """
    pattern = r'^IR(\d{2})-Z(\d{3})-V(\d{3})-B(\d{3})-(\d{6})$'
    match = re.match(pattern, uid)
    
    if not match:
        return None
    
    return {
        'year': f"20{match.group(1)}",
        'zone': f"Z{match.group(2)}",
        'vendor': f"V{match.group(3)}",
        'batch': f"B{match.group(4)}",
        'serial': match.group(5)
    }

def generate_uid(vendor_code: str, batch: str, serial: int, zone_code: str = "Z005") -> str:
    """
    Generate UID in format: IR25-Z005-V012-B045-000123
    """
    current_year = datetime.now().year
    year_suffix = str(current_year)[-2:]
    
    return f"IR{year_suffix}-{zone_code}-{vendor_code}-{batch}-{serial:06d}"

def get_vendor_name(vendor_code: str) -> str:
    """Get vendor name from code"""
    return VENDOR_MAP.get(vendor_code, "Unknown Vendor")

def get_zone_name(zone_code: str) -> str:
    """Get zone name from code"""
    return ZONE_MAP.get(zone_code, "Unknown Zone")

def get_zone_defaults(zone_code: str) -> Dict[str, any]:
    """Get default traffic density and curvature for zone"""
    return ZONE_DEFAULTS.get(zone_code, {
        'traffic_density': 20.0,
        'track_curvature': 'Moderate'
    })

def normalize_zone_input(zone_input: str) -> str:
    """
    Convert zone name to zone code or return zone code if already in correct format
    """
    # If already a zone code
    if zone_input.startswith('Z') and len(zone_input) == 4:
        return zone_input
    
    # Search by name
    for code, name in ZONE_MAP.items():
        if zone_input.lower() in name.lower():
            return code
    
    return "Z005"  # Default to Northern Railway

def normalize_vendor_input(vendor_input: str) -> str:
    """
    Convert vendor name to vendor code or return vendor code if already in correct format
    """
    # If already a vendor code
    if vendor_input.startswith('V') and len(vendor_input) == 4:
        return vendor_input
    
    # Search by name
    for code, name in VENDOR_MAP.items():
        if vendor_input.lower() in name.lower():
            return code
    
    return "V001"  # Default vendor

def validate_component_type(component_type: str) -> str:
    """
    Validate and normalize component type
    """
    valid_types = {
        'elastic rail clips': 'Elastic Rail Clips',
        'erc': 'Elastic Rail Clips',
        'liners': 'Liners',
        'liner': 'Liners',
        'rail pad': 'Rail Pad',
        'rail_pad': 'Rail Pad',
        'sleeper': 'Sleeper',
        'sleepers': 'Sleeper'
    }
    
    normalized = component_type.lower().strip()
    return valid_types.get(normalized, component_type.title())
