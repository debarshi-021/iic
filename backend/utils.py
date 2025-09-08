def parse_uid(uid: str):
    parts = uid.split("-")
    if len(parts) >= 5:
        return {
            "ir": parts[0],
            "zone": parts[1],
            "vendor": parts[2],
            "batch": parts[3],
            "serial": parts[4]
        }
    return {}

ZONE_DEFAULTS = {
    "Z001": (50.0, "Straight"),
    "Z002": (45.0, "Moderate Curve"),
    "Z003": (20.0, "Sharp Curve"),
    # add more Z004..Z018 as needed
}
