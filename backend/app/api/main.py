from fastapi import APIRouter
from app.api.routes import users, login, map, next_stop, address, status, order, courier, verification, messages

router = APIRouter()
router.include_router(users.router)
router.include_router(login.router)
router.include_router(map.router)
router.include_router(next_stop.router)


router.include_router(address.router)
router.include_router(status.router)
router.include_router(order.router)
router.include_router(courier.router)
router.include_router(verification.router)
router.include_router(messages.router)