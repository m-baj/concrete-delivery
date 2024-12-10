# This file contains the model classes for the database tables.
from sqlmodel import SQLModel, Field


class Status(SQLModel, table=True):
    StatusID: int = Field(primary_key=True)
    Name: str = Field(max_length=255, unique=True, index=True)