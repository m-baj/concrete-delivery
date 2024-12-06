from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
from app import models
from app.database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()
models.Base.metadata.create_all(bind=engine)  # Tworzy tabele w bazie danych


class Status(BaseModel):
    StatusID: int
    Name: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


@app.get("/")
def index():
    return {"message": "Hello, World!"}


@app.get("/status", response_model=List[Status])
def get_statuses(db: db_dependency):
    statuses = db.query(models.Status).all()
    return statuses


@app.post("/status", response_model=Status)
def create_status(status: Status, db: db_dependency):
    db_status = models.Status(Name=status.Name)
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status
