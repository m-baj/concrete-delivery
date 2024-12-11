import os

from fastapi import FastAPI
from app.core.config import settings
# from pydantic import BaseModel
# from typing import List, Annotated
# from app import models
# from app.database import engine, SessionLocal
from app.neo4j_database import Courier, Location, BelongsTo
from neontology import init_neontology, Neo4jConfig
from neo4j import GraphDatabase

app = FastAPI()
#     title=settings.PROJECT_NAME
# )

# uri = "bolt://localhost:7687"
# driver = GraphDatabase.driver(uri, auth=("neo4j", "krecimybeton"))

@app.on_event("startup")
async def startup_event():

    # username, password = os.getenv("NEO4J_AUTH").split("/")
    # uri = os.getenv("NEO4J_URI")
    #
    # config = Neo4jConfig(
    #     uri=uri,
    #     username=username,
    #     password=password
    # )
    NEO4J_URI="bolt://localhost:7687"
    NEO4J_USERNAME="neo4j"
    NEO4J_PASSWORD="krecimybeton"

    config = Neo4jConfig(
        uri=NEO4J_URI,
        username=NEO4J_USERNAME,
        password=NEO4J_PASSWORD
    )
    init_neontology(config)


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

@app.get("/couriers")
async def get_couriers():
    couriers = Courier.match_nodes()
    result = []
    for courier in couriers:
        locations = [location.address for location in courier.locations]
        result.append({"courierID": courier.courierID, "name": courier.name, "locations": locations})
    return result