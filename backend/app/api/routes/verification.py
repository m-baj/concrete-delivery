from fastapi import APIRouter, HTTPException
from app.services.twilio_service import TwilioService

router = APIRouter(prefix="/verification", tags=["verification"])
twilio_service = TwilioService()

@router.post("/send-code")
async def send_code(phone_number: str):
    result = twilio_service.send_verification_code(phone_number)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    return {"message": "Code sent successfully"}

@router.post("/verify-code")
async def verify_code(phone_number: str, code: str):
    result = twilio_service.verify_code(phone_number, code)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("message", result["error"]))
    return {"message": "Code verified successfully"}
