# all database operations are done here
from sqlmodel import Session, select

from app.models import *
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


def get_user_by_id(*, session: Session, user_id: str) -> User | None:
    query = select(User).where(User.id == user_id)
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


def delete_address(*, session: Session, address_id: str) -> Address | None:
    query = select(Address).where(Address.id == address_id)
    address = session.exec(query).first()
    if address:
        session.delete(address)
        session.commit()
    return address


def get_address_by_id(*, session: Session, address_id: str) -> Address | None:
    query = select(Address).where(Address.id == address_id)
    address = session.exec(query).first()
    return address


def get_status(*, session: Session, status_id: str) -> Status | None:
    query = select(Status).where(Status.id == status_id)
    status = session.exec(query).first()
    return status


def add_status(*, session: Session, status: StatusCreate) -> Status:
    db_obj = Status.model_validate(status)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def create_order(*, session: Session, order: OrderBase) -> Order:
    db_obj = Order.model_validate(order)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_courier_by_phone_number(
    *, session: Session, phone_number: str
) -> Courier | None:
    query = select(Courier).where(Courier.phone_number == phone_number)
    courier = session.exec(query).first()
    return courier


def get_courier_by_id(*, session, courier_id: str) -> Courier | None:
    query = select(Courier).where(Courier.id == courier_id)
    courier = session.exec(query).first()
    return courier


def create_courier(*, session: Session, courier_to_create: CourierBase) -> Courier:
    db_obj = Courier.model_validate(courier_to_create)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj
