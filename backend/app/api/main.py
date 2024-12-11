from fastapi import APIRouter
from app.api.routes import users, login

router = APIRouter()
router.include_router(users.router)
router.include_router(login.router)
