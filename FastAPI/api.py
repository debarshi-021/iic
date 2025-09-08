import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field
from datetime import datetime, timedelta

# --- 1. Initialize the FastAPI App ---
app = FastAPI(
    title="Railway Fitting Maintenance API",
    description="Predicts remaining lifespan and schedules maintenance for track fittings.",
    version="1.0.0"
)

# --- 2. Load the Prediction Pipeline ---
# This is loaded once when the application starts for maximum efficiency.
try:
    model_pipeline = joblib.load('Rail_Predict_Pipeline.joblib')
    print("✅ Model pipeline loaded successfully.")
except FileNotFoundError:
    model_pipeline = None
    print("❌ CRITICAL ERROR: 'Rail_Predict_Pipeline.joblib' not found. API cannot make predictions.")

# --- 3. Define the Business Logic ---
# This function is copied directly from your previous script.
# It translates the model's numerical output into actionable instructions.
def assign_maintenance_schedule(predicted_days: int):
    """
    Takes the predicted remaining lifespan in days and returns both
    the priority level and the next scheduled maintenance date.
    """
    today = datetime.now().date()
    
    if predicted_days <= 180:  # 6 months or less
        priority = 'Urgent'
        next_date = today + timedelta(days=30) # Inspect within 1 month
    elif 180 < predicted_days <= 730: # Between 6 months and 2 years
        priority = 'Routine'
        next_date = today + timedelta(days=180) # Inspect within 6 months
    else: # More than 2 years
        priority = 'Basic'
        next_date = today + timedelta(days=365) # Inspect within 1 year
        
    return priority, next_date

# --- 4. Define the API Input Structure ---
# Pydantic model ensures that any data sent to the API matches this structure.
class TrackComponent(BaseModel):
    Component_Type: str
    Manufacturer: str
    Official_Zone: str
    Installation_Zone: str
    Traffic_Density_GMT: float
    Track_Curvature: str
    Maintenance_History: str
    Installation_Year: int
    Installation_Month: int
    Warranty_Period_Years: int
    Component_Age_Days: int

# --- 5. Create the Prediction Endpoint ---
@app.post("/predict_maintenance")
def predict_maintenance_plan(component: TrackComponent):
    """
    Receives component data and returns a full maintenance plan.
    """
    if model_pipeline is None:
        return {"error": "Model is not available. Please check server logs."}

    # Step A: Convert the input data into a DataFrame for the model
    input_df = pd.DataFrame([component.dict()])

    # Step B: Use the pipeline to predict the remaining lifespan (The AI part)
    predicted_lifespan = model_pipeline.predict(input_df)
    prediction_days = int(predicted_lifespan[0])

    # Step C: Use the business logic to get priority and next date (The Rules part)
    priority, next_date = assign_maintenance_schedule(prediction_days)

    # Step D: Return the complete response
    return {
        "predicted_remaining_lifespan_days": prediction_days,
        "maintenance_priority": priority,
        "next_maintenance_date": next_date.isoformat()
    }

@app.get("/")
def health_check():
    return {"status": "API is running."}

