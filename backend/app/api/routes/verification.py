from fastapi import APIRouter, HTTPException
from app.services.twilio_service import TwilioService
from app.models import SendCodeRequest, VerifyCodeRequest

router = APIRouter(prefix="/verification", tags=["verification"])
twilio_service = TwilioService()

@router.post("/send-code")
async def send_code(data: SendCodeRequest):
    print(f"Sending code to {data.phone_number}")
    result = twilio_service.send_verification_code(data.phone_number)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    return {"message": "Code sent successfully"}

@router.post("/verify-code")
async def verify_code(data: VerifyCodeRequest):
    result = twilio_service.verify_code(data.phone_number, data.code)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("message", result["error"]))
    return {"message": "Code verified successfully"}
