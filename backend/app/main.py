from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.main import router


app = FastAPI(title=settings.PROJECT_NAME)
<<<<<<< Updated upstream

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
=======

origins = [
    "http://localhost:3000",
]
# Dodanie CORS middleware (wrzucasz tutaj)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Zezwala na dowolne źródła (używaj tylko na testach)
>>>>>>> Stashed changes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
