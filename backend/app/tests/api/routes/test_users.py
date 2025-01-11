from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app.core.security import verify_password
from app.models import User
from app.tests.utils.utils import random_lower_string, random_phone_number, random_email


def test_register_user(client: TestClient, db: Session):
    name = random_lower_string()
    surname = random_lower_string()
    phone_number = random_phone_number()
    email = random_email()
    password = random_lower_string()
    data = {
        "name": name,
        "surname": surname,
        "phone_number": phone_number,
        "email_address": email,
        "password": password,
    }
    response = client.post("/users/register", json=data)
    assert response.status_code == 200
    user = response.json()
    assert user["name"] == name
    assert user["surname"] == surname
    assert user["phone_number"] == phone_number
    user_query = select(User).where(User.phone_number == phone_number)
    db_user = db.exec(user_query).first()
    assert db_user is not None
    assert db_user.name == name
    assert db_user.surname == surname
    assert db_user.phone_number == phone_number
    assert verify_password(password, db_user.hashed_password)


def test_register_user_already_exists(client: TestClient, db: Session):
    name = random_lower_string()
    surname = random_email()
    phone_number = "123"
    email = random_email()
    password = random_lower_string()
    data = {
        "name": name,
        "surname": surname,
        "phone_number": phone_number,
        "email_address": email,
        "password": password,
    }
    response = client.post("/users/register", json=data)
    assert response.status_code == 400
    assert response.json() == {
        "detail": "User with given phone number already exists in the system"
    }
