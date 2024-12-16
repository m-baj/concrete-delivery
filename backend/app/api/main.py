from fastapi import APIRouter
from app.api.routes import users, login, map

router = APIRouter()
router.include_router(users.router)
router.include_router(login.router)
router.include_router(map.router)
