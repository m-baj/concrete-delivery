from fastapi.testclient import TestClient

from app.core.config import settings

def test_login(client: TestClient) -> None:
    login_data = {
        "username": settings.ADMIN_PHONE_NUMBER,
        "password": settings.ADMIN_PASSWORD
    }
    response = client.post("/login", data=login_data)
    token = response.json()
    assert response.status_code == 200
    assert "access_token" in token
    assert token["access_token"]

def test_login_wrong_password(client: TestClient) -> None:
    login_data = {
        "username": settings.ADMIN_PHONE_NUMBER,
        "password": "wrong_password"
    }
    response = client.post("/login", data=login_data)
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect phone number or password"}