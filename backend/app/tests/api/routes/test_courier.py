from fastapi.testclient import TestClient
from app.main import app  # Upewnij się, że importujesz swoją aplikację FastAPI
from app.models import CourierRegister, AccountType
from app.core.config import settings
from app.tests.utils.utils import (
    random_lower_string,
    random_phone_number,
    random_email,
    random_number_to_100,
    random_uuid4,
)
import uuid


client = TestClient(app)


# def get_admin_token(client: TestClient) -> str:
#     login_data = {
#         "username": settings.ADMIN_PHONE_NUMBER,
#         "password": settings.ADMIN_PASSWORD,
#     }
#     response = client.post("/login", data=login_data)
#     assert response.status_code == 200
#     token = response.json()["access_token"]
#     return f"Bearer {token}"


def test_register_courier():
    # Zakładając, że masz już zalogowanego admina
    login_data = {
        "username": settings.ADMIN_PHONE_NUMBER,
        "password": settings.ADMIN_PASSWORD,
    }
    response = client.post("/login", data=login_data)
    admin_token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    courier_data = {
        "name": random_lower_string(),
        "surname": random_lower_string(),
        "phone_number": random_phone_number(),
        "home_address": {
            "city": "Warszawa",
            "postal_code": "12-345",
            "street": "Street",
            "house_number": "1",
            "apartment_number": "1",
        },
        "email_address": random_email(),
        "password": "securepassword",
    }
    response = client.post("/courier/register", json=courier_data, headers=headers)
    assert response.status_code == 200
    courier = response.json()
    assert courier["name"] == courier_data["name"]
    assert courier["surname"] == courier_data["surname"]
    assert courier["phone_number"] == courier_data["phone_number"]


def test_set_courier_status():
    login_data = {
        "username": settings.ADMIN_PHONE_NUMBER,
        "password": settings.ADMIN_PASSWORD,
    }
    response = client.post("/login", data=login_data)
    admin_token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    courier_data = {
        "name": random_lower_string(),
        "surname": random_lower_string(),
        "phone_number": random_phone_number(),
        "home_address": {
            "city": "Warszawa",
            "postal_code": "12-346",
            "street": "Street",
            "house_number": "2",
            "apartment_number": "2",
        },
        "email_address": random_email(),
        "password": "securepassword",
    }
    response = client.post("/courier/register", json=courier_data, headers=headers)
    assert response.status_code == 200
    courier_id = response.json()["id"]
    original_status_id = response.json()["status_id"]
    status_id = uuid.uuid4()  # Generowanie UUID

    response = client.put(
        f"/courier/status/{courier_id}?status_id={status_id}", headers=headers
    )
    assert response.status_code == 200


def test_get_all_couriers():
    login_data = {
        "username": settings.ADMIN_PHONE_NUMBER,
        "password": settings.ADMIN_PASSWORD,
    }
    response = client.post("/login", data=login_data)
    admin_token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    courier_data = {
        "name": random_lower_string(),
        "surname": random_lower_string(),
        "phone_number": random_phone_number(),
        "home_address": {
            "city": "Warszawa",
            "postal_code": "12-346",
            "street": "Street",
            "house_number": "2",
            "apartment_number": "2",
        },
        "email_address": random_email(),
        "password": "securepassword",
    }
    response = client.post("/courier/register", json=courier_data, headers=headers)
    headers = {"Authorization": f"Bearer {admin_token}"}

    response = client.get("/courier/all_couriers", headers=headers)
    assert response.status_code == 200
    couriers = response.json()
    assert isinstance(couriers, list)


def test_get_courier_home_address():
    login_data = {
        "username": settings.ADMIN_PHONE_NUMBER,
        "password": settings.ADMIN_PASSWORD,
    }
    response = client.post("/login", data=login_data)
    admin_token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    courier_data = {
        "name": random_lower_string(),
        "surname": random_lower_string(),
        "phone_number": random_phone_number(),
        "home_address": {
            "city": "Warszawa",
            "postal_code": "12-345",
            "street": "Street",
            "house_number": "4",
            "apartment_number": "1",
        },
        "email_address": random_email(),
        "password": "securepassword",
    }
    response = client.post("/courier/register", json=courier_data, headers=headers)
    assert response.status_code == 200
    courier = response.json()
    courier_id = courier["id"]
    response = client.get(f"/courier/home_address/{courier_id}")
    assert response.status_code == 200
    home_address = response.json()
    assert "city" in home_address
    assert "street" in home_address


def test_get_courier_complex():
    login_data = {
        "username": settings.ADMIN_PHONE_NUMBER,
        "password": settings.ADMIN_PASSWORD,
    }
    response = client.post("/login", data=login_data)
    admin_token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    courier_data = {
        "name": random_lower_string(),
        "surname": random_lower_string(),
        "phone_number": random_phone_number(),
        "home_address": {
            "city": "Warszawa",
            "postal_code": "12-345",
            "street": "Street",
            "house_number": "5",
            "apartment_number": "1",
        },
        "email_address": random_email(),
        "password": "securepassword",
    }
    response = client.post("/courier/register", json=courier_data, headers=headers)
    assert response.status_code == 200
    courier = response.json()
    courier_id = courier["id"]
    print(courier_id)
    response = client.get(f"/courier/complex/{courier_id}")
    assert response.status_code == 200
    courier_data = response.json()
    assert "id" in courier_data
    assert "name" in courier_data
    assert "homeAddress" in courier_data


def test_get_all_couriers_complex():
    response = client.get("/courier/complex_all")
    assert response.status_code == 200
    couriers_data = response.json()
    assert isinstance(couriers_data, list)
    for courier_data in couriers_data:
        assert "id" in courier_data
        assert "name" in courier_data
        assert "homeAddress" in courier_data
