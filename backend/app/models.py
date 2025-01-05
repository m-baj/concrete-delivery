# This file contains the model classes for the database tables.
import uuid
from sqlmodel import SQLModel, Field
from pydantic import EmailStr
import datetime
from enum import Enum


class AccountType(str, Enum):
    USER = "user"
    COURIER = "courier"
    ADMIN = "admin"


class UserBase(SQLModel):
    name: str = Field(max_length=40)
    surname: str = Field(max_length=40)
    phone_number: str
    email_address: EmailStr | None = Field(default=None, max_length=255)
    account_type: AccountType = AccountType.USER


# data received by API during user registration
class UserRegister(SQLModel):
    name: str = Field(max_length=40)
    surname: str = Field(max_length=40)
    phone_number: str
    email_address: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserCourierCreate(UserCreate):
    courier_id: uuid.UUID
    account_type: AccountType = AccountType.COURIER


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    courier_id: uuid.UUID | None = None


# data returned from API on user creation
class UserPublic(UserBase):
    id: uuid.UUID
    courier_id: uuid.UUID | None = None


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class AddressBase(SQLModel):
    city: str
    postal_code: str
    street: str
    house_number: str
    apartment_number: str | None = Field(default=None)


class AddressCreate(AddressBase):
    pass


class Address(AddressBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    X_coordinate: float | None = None
    Y_coordinate: float | None = None


class AddressPublic(AddressBase):
    id: uuid.UUID


class StatusBase(SQLModel):
    name: str


class StatusCreate(StatusBase):
    pass


class Status(StatusBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class StatusPublic(StatusBase):
    id: uuid.UUID


class OrderBase(SQLModel):
    user_id: uuid.UUID
    courier_id: uuid.UUID | None
    pickup_address_id: uuid.UUID
    delivery_address_id: uuid.UUID
    status_id: uuid.UUID | None
    pickup_start_time: str | None = None
    pickup_end_time: str | None = None
    delivery_start_time: str | None = None
    delivery_end_time: str | None = None


class OrderCreate(SQLModel):
    pickup_address: AddressCreate
    delivery_address: AddressCreate
    pickup_start_time: str
    pickup_end_time: str
    delivery_start_time: str
    delivery_end_time: str


class Order(OrderBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    order_date: datetime.datetime = Field(default_factory=datetime.datetime.now)


class OrderPublic(OrderBase):
    id: uuid.UUID
    user_id: uuid.UUID


class CourierBase(SQLModel):
    name: str
    surname: str
    phone_number: str
    home_address_id: uuid.UUID
    status_id: uuid.UUID | None = None


class CourierRegister(SQLModel):
    name: str
    surname: str
    phone_number: str
    home_address: AddressCreate
    email_address: EmailStr | None = Field(default=None, max_length=255)
    password: str = Field(min_length=8, max_length=40)


class Courier(CourierBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class CourierPublic(CourierBase):
    id: uuid.UUID

class SendCodeRequest(SQLModel):
    phone_number: str

class VerifyCodeRequest(SQLModel):
    phone_number: str
    code: str