# This file contains the model classes for the database tables.
import uuid
from sqlmodel import SQLModel, Field
from pydantic import EmailStr

# class Status(SQLModel, table=True):
#     Status: int = Field(primary_key=True)
#     Name: str = Field(max_length=255, unique=True, index=True)

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
    email_address: EmailStr | None = Field(default=None, max_length=255)
    password: str = Field(min_length=8, max_length=40)

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str

# data returned from API on user creation
class UserPublic(UserBase):
    id: uuid.UUID