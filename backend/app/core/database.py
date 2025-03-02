from sqlmodel import create_engine, SQLModel, Session
from neomodel import config
from app.core.config import settings
from app.core.initial_data import load_initial_data

engine = create_engine(str(settings.DATABASE_URL))


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        load_initial_data(session)

def init_neo4j() -> None:
    config.DATABASE_URL = settings.NEO4J_URL
    config.DATABASE_NAME = settings.NEO4J_NAME

if __name__ == "__main__":
    init_db()
    init_neo4j()
