from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database import Base


class Status(Base):
    __tablename__ = "Status"

    StatusID = Column(Integer, primary_key=True, index=True)
    Name = Column(String, unique=True, index=True)
