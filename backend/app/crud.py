# all database operations are done here
from sqlmodel import Session, select

from app.models import User, UserCreate
from app.core.security import get_password_hash

def create_user(*, session: Session, user_to_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_to_create, update={"hashed_password": get_password_hash(user_to_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def get_user_by_phone_number(*, session: Session, phone_number: str) -> User | None:
    pass
