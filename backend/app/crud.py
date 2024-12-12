# all database operations are done here
from sqlmodel import Session, select

from app.models import User, UserCreate

def create_user(*, session: Session, user_to_create: UserCreate):
    pass

def get_user_by_phone_number(*, session: Session, phone_number: str) -> User | None:
    pass
