from sqlmodel import Session

from app import crud
from app.models import UserCreate
from app.tests.utils.utils import random_email, random_lower_string
from app.core.security import verify_password

user_data = {
    "name": random_lower_string(),
    "surname": random_lower_string(),
    "phone_number": random_lower_string(),
    "email_address": random_email(),
    "password": random_lower_string()
}

def test_create_user(db: Session):
    user_in = UserCreate(**user_data)
    user = crud.create_user(session=db, user_to_create=user_in)
    assert user.name == user_data["name"]
    assert user.surname == user_data["surname"]
    assert user.phone_number == user_data["phone_number"]
    assert user.email_address == user_data["email_address"]
    assert user.is_admin == False
    assert hasattr(user, "id")
    assert hasattr(user, "hashed_password")

def test_get_user_by_phone_number(db: Session):
    user_in = UserCreate(**user_data)
    user = crud.create_user(session=db, user_to_create=user_in)
    user_2 = crud.get_user_by_phone_number(session=db, phone_number=user_data["phone_number"])
    assert user_2
    assert user.name == user_2.name
    assert user.surname == user_2.surname
    assert user.phone_number == user_2.phone_number
    assert user.email_address == user_2.email_address
    assert user.is_admin == user_2.is_admin
    assert verify_password(user_data["password"], user_2.hashed_password)

def test_authenticate(db: Session):
    user_in = UserCreate(**user_data)
    user = crud.create_user(session=db, user_to_create=user_in)
    user_2 = crud.authenticate(session=db, phone_number=user_data["phone_number"], password=user_data["password"])
    assert user_2
    assert user.name == user_2.name
    assert user.surname == user_2.surname
    assert user.phone_number == user_2.phone_number
    assert user.email_address == user_2.email_address
    assert user.is_admin == user_2.is_admin
    assert  user_2 is not None
    assert verify_password(user_data["password"], user_2.hashed_password)

def test_authenticate_wrong_password(db: Session):
    user_in = UserCreate(**user_data)
    user = crud.create_user(session=db, user_to_create=user_in)
    user_2 = crud.authenticate(session=db, phone_number=user_data["phone_number"], password="wrong_password")
    assert user_2 is None