from fastapi import FastAPI
from app.core.config import settings
# from pydantic import BaseModel
# from typing import List, Annotated
# from app import models
# from app.database import engine, SessionLocal


app = FastAPI(
    title=settings.PROJECT_NAME
)


# class Status(BaseModel):
#     StatusID: int
#     Name: str
#
#
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
#
#
# db_dependency = Annotated[Session, Depends(get_db)]


@app.get("/")
def index():
    print("Hello, World!")
    return {"message": "Hello, World!"}


# @app.get("/status", response_model=List[Status])
# def get_statuses(db: db_dependency):
#     statuses = db.query(models.Status).all()
#     return statuses


# @app.post("/status")
# def create_status(status: Status, db: db_dependency):
#     db_status = models.Status(Name=status.Name)
#     db.add(db_status)
#     db.commit()
#     db.refresh(db_status)
#     return db_status
