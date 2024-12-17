from fastapi import FastAPI

from app.core.config import settings
from app.api.main import router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title=settings.PROJECT_NAME
)

# Dodanie CORS middleware (wrzucasz tutaj)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Zezwala na dowolne źródła (używaj tylko na testach)
    allow_credentials=True,
    allow_methods=["*"],  # Wszystkie metody (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Wszystkie nagłówki
)

app.include_router(router)
