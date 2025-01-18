from fastapi import APIRouter, HTTPException, Depends
from app.core.config import settings
from app.services.twilio_service import TwilioService

router = APIRouter(prefix="/messages", tags=["messages"])

@router.post("/report-lost")
def report_lost(phone_number: str):
    twilio_service = TwilioService()
    response = twilio_service.send_sms(
        phone_number=phone_number,
        message="Your package has been reported as lost. Please contact support for further assistance."
    )
    if not response["success"]:
        raise HTTPException(status_code=400, detail=f"Failed to send SMS: {response['error']}")
    return {"message": "SMS sent successfully", "sid": response.get("sid")}

@router.post("/change-status")
def change_status(phone_number: str, status: str):
    twilio_service = TwilioService()
    response = twilio_service.send_sms(
        phone_number=phone_number,
        message=f"Your package status has been changed to {status}."
    )
    if not response["success"]:
        raise HTTPException(status_code=400, detail=f"Failed to send SMS: {response['error']}")
    return {"message": "SMS sent successfully", "sid": response.get("sid")}