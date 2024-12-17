from fastapi import FastAPI

from app.core.config import settings
from app.api.main import router


app = FastAPI(
    title=settings.PROJECT_NAME
)

app.include_router(router)
app.include_router(neo4j.router, prefix="/neo4j", tags=["neo4j"])
