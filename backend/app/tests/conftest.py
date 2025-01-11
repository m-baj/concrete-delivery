import pytest
from fastapi.testclient import TestClient
from collections.abc import Generator
from app.main import app
from core.database import engine, Session


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="session", autouse=True)
def db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
