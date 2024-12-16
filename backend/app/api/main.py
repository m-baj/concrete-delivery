from fastapi import APIRouter
from app.api.routes import users, login, map, next_stop

router = APIRouter()
router.include_router(users.router)
router.include_router(login.router)
router.include_router(map.router)
router.include_router(next_stop.router)


