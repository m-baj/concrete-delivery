from collections.abc import Generator
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.database import engine
from app.main import app

@pytest.fixture(scope="session", autouse=True)
def db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

@pytest.fixture(scope="module")
def client() -> TestClient:
    with TestClient(app) as client:
        yield client