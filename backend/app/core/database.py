from sqlmodel import create_engine, SQLModel, Session

from app.core.config import settings

engine = create_engine(str(settings.DATABASE_URL))


def init_db() -> None:
    SQLModel.metadata.create_all(engine)


SQLModel.metadata.create_all(engine)

if __name__ == "__main__":
    init_db()
