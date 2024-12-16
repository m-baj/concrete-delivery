# all database operations are done here
from sqlmodel import Session, select

from app.models import User, UserCreate, Address, AddressCreate
from app.core.security import get_password_hash, verify_password


def create_user(*, session: Session, user_to_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_to_create,
        update={"hashed_password": get_password_hash(user_to_create.password)},
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_user_by_phone_number(*, session: Session, phone_number: str) -> User | None:
    query = select(User).where(User.phone_number == phone_number)
    user = session.exec(query).first()
    return user


def authenticate(*, session: Session, phone_number: str, password: str) -> User | None:
    user = get_user_by_phone_number(session=session, phone_number=phone_number)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def add_address(*, session: Session, address: AddressCreate) -> Address:
    db_obj = Address.model_validate(address)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_address(*, session: Session, address: AddressCreate) -> Address | None:
    query = select(Address).where(
        Address.city == address.city,
        Address.street == address.street,
        Address.house_number == address.house_number,
    )
    address = session.exec(query).first()
    return address
