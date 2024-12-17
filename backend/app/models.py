# This file contains the model classes for the database tables.
import uuid
from sqlmodel import SQLModel, Field
from pydantic import EmailStr
import datetime


class UserBase(SQLModel):
    name: str = Field(max_length=40)
    surname: str = Field(max_length=40)
    phone_number: str
    email_address: EmailStr | None = Field(default=None, max_length=255)
    is_admin: bool = False


# data received by API during user registration
class UserRegister(SQLModel):
    name: str = Field(max_length=40)
    surname: str = Field(max_length=40)
    phone_number: str
    email_address: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str


# data returned from API on user creation
class UserPublic(UserBase):
    id: uuid.UUID


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class AddressBase(SQLModel):
    city: str
    postal_code: str
    street: str
    house_number: str
    X_coordinate: float | None = None
    Y_coordinate: float | None = None


class AddressCreate(AddressBase):
    pass


class Address(AddressBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


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
    order_date: datetime.datetime


class OrderCreate(SQLModel):
    pickup_address: AddressCreate
    delivery_address: AddressCreate
    order_date: datetime.datetime = Field(default_factory=datetime.datetime.now)


class Order(OrderBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class OrderPublic(OrderBase):
    id: uuid.UUID
    user_id: uuid.UUID


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None
