from twilio.rest import Client
from app.core.config import settings

class TwilioService:
    def __init__(self):
        self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        self.service_sid = settings.TWILIO_VERIFY_SERVICE_SID

    def send_verification_code(self, phone_number: str) -> dict:
        try:
            verification = self.client.verify.services(self.service_sid).verifications.create(
                to=f"+48{phone_number}",
                channel="sms"
            )
            return {"success": True, "sid": verification.sid}
        except Exception as e:
            print(f"Error sending verification code: {e}")
            return {"success": False, "error": str(e)}

    def verify_code(self, phone_number: str, code: str) -> dict:
        try:
            verification_check = self.client.verify.services(self.service_sid).verification_checks.create(
                to=f"+48{phone_number}",
                code=code
            )
            if verification_check.status == "approved":
                return {"success": True}
            return {"success": False, "message": "Invalid code"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def send_sms(self, phone_number: str, message: str) -> dict:
        try:
            message = self.client.messages.create(
                to=f"+48{phone_number}",
                from_=settings.TWILIO_PHONE_NUMBER,
                body=message
            )
            return {"success": True, "sid": message.sid}
        except Exception as e:
            return {"success": False, "error": str(e)}
