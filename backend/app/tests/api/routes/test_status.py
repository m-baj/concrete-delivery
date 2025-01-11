from fastapi.testclient import TestClient
from app.main import app 
from app.models import StatusCreate
from app.core.config import settings

client = TestClient(app)


def test_add_status():
    status_data = {
        "name": "In Progress",
    }
    response = client.post("/status/", json=status_data)
    assert response.status_code == 200
    status = response.json()
    assert status["name"] == status_data["name"]


def test_get_status_by_name():
    status_data = {
        "name": "In Progress",
    }
    response = client.post("/status/", json=status_data)
    status_name = "In Progress"
    response = client.get(f"/status/name?status_name={status_name}")
    assert response.status_code == 200
    status = response.json()
    assert status["name"] == status_name


def test_get_status():
    status_data = {
        "name": "Delivered",
    }
    response = client.post("/status/", json=status_data)
    status_id = response.json()["id"]
    assert response.status_code == 200
    response = client.get(f"/status/{status_id}")
    assert response.status_code == 200
    status = response.json()
    assert status["id"] == status_id
    assert status["name"] == status_data["name"]
