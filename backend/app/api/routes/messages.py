from fastapi import APIRouter, HTTPException, Depends
from app.core.config import settings
from app.services.twilio_service import TwilioService
from app.models import ReportRequest
from app.api.dependecies import SessionDep
from app.models import Order, Status, User

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/change-status")
def change_status(request: ReportRequest, session: SessionDep):
    order = session.query(Order).filter(Order.id == request.OrderID).first()
    user = session.query(User).filter(User.id == order.user_id).first()
    phone_number = user.phone_number
    twilio_service = TwilioService()
    if request.OrderType == "Order lost":
        response = twilio_service.send_sms(
            phone_number=phone_number,
            message=f"Your package with ID {request.OrderID} has been reported as lost. Please contact support for further assistance."
        )
    else:
        response = twilio_service.send_sms(
            phone_number=phone_number,
            message=f"Your package with ID {request.OrderID} status has been changed to {request.OrderType}."
        )
    if not response["success"]:
        raise HTTPException(status_code=400, detail=f"Failed to send SMS: {response['error']}")
    status = session.query(Status).filter(Status.name == request.OrderType).first()
    order.status_id = status.id
    session.commit()
    return {
        "message": "SMS sent successfully and package status updated",
        "sid": response.get("sid"),
        }