import os, httpx, asyncio
ML_API_URL = os.getenv("ML_API_URL", "http://127.0.0.1:8000/predict_maintenance")
TIMEOUT = 6.0
MAX_RETRIES = 2

async def call_ml(payload: dict):
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        last_exc = None
        for attempt in range(MAX_RETRIES+1):
            try:
                resp = await client.post(ML_API_URL, json=payload)
                resp.raise_for_status()
                return resp.json()
            except httpx.HTTPStatusError as e:
                if 400 <= e.response.status_code < 500:
                    return {"error": "ml_4xx", "detail": str(e)}
                last_exc = e
            except Exception as e:
                last_exc = e
            await asyncio.sleep(0.5*(attempt+1))
        raise last_exc
