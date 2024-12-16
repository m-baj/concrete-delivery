from fastapi import APIRouter
from app.api.routes import users, login, address, status, order

router = APIRouter()
router.include_router(users.router)
router.include_router(login.router)
router.include_router(address.router)
router.include_router(status.router)
router.include_router(order.router)
