import uuid
import pytest
from sqlmodel import Session
from app.models import (
    UserCreate,
    AddressCreate,
    StatusCreate,
    OrderBase,
    CourierBase,
    CourierRegister,
    Courier,
    OrderCreate,
)
import app.crud as crud
from app.core.security import verify_password
from app.core.config import settings
from fastapi.testclient import TestClient
from app.core.security import verify_password
from app.tests.utils.utils import (
    random_lower_string,
    random_phone_number,
    random_email,
    random_number_to_100,
    random_uuid4,
)


from app.models import OrderCreate


def test_create_user(db: Session):
    user_data = UserCreate(
        phone_number="123456789", password="password123", name="Test", surname="User"
    )
    user = crud.create_user(session=db, user_to_create=user_data)
    assert user.phone_number == user_data.phone_number
    assert user.name == user_data.name
    assert user.surname == user_data.surname


def test_get_user_by_phone_number(db: Session):
    phone_number = "000000000"
    user = crud.get_user_by_phone_number(session=db, phone_number=phone_number)
    assert user is not None
    assert user.phone_number == phone_number


def test_get_user_by_id(db: Session):
    user = crud.create_user(
        session=db,
        user_to_create=UserCreate(
            phone_number="123456789",
            password="password123",
            name="Test",
            surname="User",
        ),
    )
    user = crud.get_user_by_phone_number(session=db, phone_number="123456789")
    id_user = crud.get_user_by_id(session=db, user_id=user.id)
    assert user is not None
    assert user == id_user


def test_authenticate(db: Session):
    phone_number = "123456789"
    password = "password123"

    user = crud.authenticate(session=db, phone_number=phone_number, password=password)
    assert user is not None
    assert user.phone_number == phone_number
    assert verify_password(password, user.hashed_password)


def change_user_password(db: Session):
    new_password = "new_password"
    user = crud.change_user_password(
        session=db, phone_number="123456789", new_password=new_password
    )
    assert user is not None
    assert user.hashed_password == new_password


def test_add_address(db: Session):
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)
    assert address is not None
    assert address.city == address_data.city
    assert address.street == address_data.street


def test_get_address(db: Session):
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)
    retrieved_address = crud.get_address(session=db, address=address_data)
    assert retrieved_address is not None
    assert retrieved_address.city == address_data.city
    assert retrieved_address.street == address_data.street


def test_delete_address(db: Session):
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)
    address = crud.delete_address(session=db, address_id=address.id)
    assert address.street == address_data.street


def test_get_address_by_id(db: Session):
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)
    retrieved_address = crud.get_address_by_id(session=db, address_id=address.id)
    assert retrieved_address is not None
    assert retrieved_address.id == address.id
    assert retrieved_address.city == address_data.city
    assert retrieved_address.street == address_data.street


def test_get_address_by_coordinates(db: Session):
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)
    retrieved_address = crud.get_address_by_coordinates(
        session=db, x=address.X_coordinate, y=address.Y_coordinate
    )
    assert retrieved_address.street == address.street


def test_update_X_coordinate(db: Session):
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)
    new_X = 50.0
    updated_address = crud.update_X_coordinate(
        session=db, address_id=address.id, new_X=new_X
    )
    assert updated_address is not None
    assert updated_address.X_coordinate == new_X


def test_update_Y_coordinate(db: Session):
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)
    new_Y = 50.0
    updated_address = crud.update_Y_coordinate(
        session=db, address_id=address.id, new_Y=new_Y
    )
    assert updated_address is not None
    assert updated_address.Y_coordinate == new_Y


def test_add_status(db: Session):
    status_data = StatusCreate(name="Test Status")
    status = crud.add_status(session=db, status=status_data)
    assert status.name == status_data.name


def test_get_status(db: Session):
    status_data = StatusCreate(name="Test Status")
    status = crud.add_status(session=db, status=status_data)
    retrieved_status = crud.get_status(session=db, status_id=status.id)
    assert retrieved_status is not None
    assert retrieved_status.name == status_data.name


def test_get_status_by_name(db: Session):
    status_data = StatusCreate(name="Test Status")
    status = crud.add_status(session=db, status=status_data)
    retrieved_status = crud.get_status_by_name(session=db, status_name=status_data.name)
    assert retrieved_status is not None
    assert retrieved_status.name == status_data.name


def test_create_order(db: Session):
    pickup_address = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    pickup_address = crud.add_address(session=db, address=pickup_address)
    delivery_address = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Polna",
        house_number="13",
        apartment_number="1",
    )
    delivery_address = crud.add_address(session=db, address=delivery_address)
    order_data = OrderCreate(
        pickup_address=pickup_address,
        delivery_address=delivery_address,
        recipient_phone_number="123456789",
        pickup_start_time="08:00",
        pickup_end_time="09:00",
        delivery_start_time="10:00",
        delivery_end_time="11:00",
    )

    order_data = OrderBase(
        user_id=uuid.uuid4(),
        courier_id=None,
        pickup_address_id=pickup_address.id,
        delivery_address_id=delivery_address.id,
        status_id=None,
        recipient_phone_number=order_data.recipient_phone_number,
        pickup_start_time=order_data.pickup_start_time,
        pickup_end_time=order_data.pickup_end_time,
        delivery_start_time=order_data.delivery_start_time,
        delivery_end_time=order_data.delivery_end_time,
    )
    order = crud.create_order(session=db, order=order_data)
    assert order.pickup_address_id == pickup_address.id
    assert order.delivery_address_id == delivery_address.id
    assert order.recipient_phone_number == order_data.recipient_phone_number


def test_assign_courier_to_order(db: Session):
    pickup_address = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    pickup_address = crud.add_address(session=db, address=pickup_address)
    delivery_address = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Polna",
        house_number="13",
        apartment_number="1",
    )
    delivery_address = crud.add_address(session=db, address=delivery_address)
    order_data = OrderCreate(
        pickup_address=pickup_address,
        delivery_address=delivery_address,
        recipient_phone_number="123456799",
        pickup_start_time="08:00",
        pickup_end_time="09:00",
        delivery_start_time="15:00",
        delivery_end_time="16:00",
    )

    order_data = OrderBase(
        user_id=uuid.uuid4(),
        courier_id=None,
        pickup_address_id=pickup_address.id,
        delivery_address_id=delivery_address.id,
        status_id=None,
        recipient_phone_number=order_data.recipient_phone_number,
        pickup_start_time=order_data.pickup_start_time,
        pickup_end_time=order_data.pickup_end_time,
        delivery_start_time=order_data.delivery_start_time,
        delivery_end_time=order_data.delivery_end_time,
    )
    order = crud.create_order(session=db, order=order_data)
    # Najpierw utwórz adres, który będzie używany jako home_address_id
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)

    # Utwórz status, który będzie używany jako status_id
    status_data = StatusCreate(name="Test Status")
    status = crud.add_status(session=db, status=status_data)

    # Utwórz dane kuriera
    courier_data = CourierBase(
        phone_number=random_phone_number(),
        name=random_lower_string(),
        surname=random_lower_string(),
        home_address_id=address.id,
        status_id=status.id,
    )

    # Utwórz kuriera w bazie danych
    courier = crud.create_courier(session=db, courier_to_create=courier_data)
    order = crud.assign_courier_to_order(
        session=db, order_id=order.id, courier_id=courier.id
    )
    assert order.courier_id == courier.id


def test_get_order_by_id(db: Session):
    pickup_address = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    pickup_address = crud.add_address(session=db, address=pickup_address)
    delivery_address = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Polna",
        house_number="13",
        apartment_number="1",
    )
    delivery_address = crud.add_address(session=db, address=delivery_address)
    order_data = OrderCreate(
        pickup_address=pickup_address,
        delivery_address=delivery_address,
        recipient_phone_number="123456789",
        pickup_start_time="08:00",
        pickup_end_time="09:00",
        delivery_start_time="10:00",
        delivery_end_time="11:00",
    )

    my_uuid = uuid.uuid4()

    order_data = OrderBase(
        user_id=my_uuid,
        courier_id=None,
        pickup_address_id=pickup_address.id,
        delivery_address_id=delivery_address.id,
        status_id=None,
        recipient_phone_number=order_data.recipient_phone_number,
        pickup_start_time=order_data.pickup_start_time,
        pickup_end_time=order_data.pickup_end_time,
        delivery_start_time=order_data.delivery_start_time,
        delivery_end_time=order_data.delivery_end_time,
    )
    order = crud.create_order(session=db, order=order_data)
    order = crud.get_order_by_id(session=db, order_id=order.id)
    assert order is not None
    assert order.user_id == my_uuid
    assert order.pickup_address_id == pickup_address.id
    assert order.delivery_address_id == delivery_address.id


def test_get_all_orders(db: Session):
    pickup_address = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    pickup_address = crud.add_address(session=db, address=pickup_address)
    delivery_address = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Polna",
        house_number="13",
        apartment_number="1",
    )
    delivery_address = crud.add_address(session=db, address=delivery_address)
    order_data = OrderCreate(
        pickup_address=pickup_address,
        delivery_address=delivery_address,
        recipient_phone_number="123456789",
        pickup_start_time="08:00",
        pickup_end_time="09:00",
        delivery_start_time="10:00",
        delivery_end_time="11:00",
    )

    my_uuid = uuid.uuid4()

    order_data = OrderBase(
        user_id=my_uuid,
        courier_id=None,
        pickup_address_id=pickup_address.id,
        delivery_address_id=delivery_address.id,
        status_id=None,
        recipient_phone_number=order_data.recipient_phone_number,
        pickup_start_time=order_data.pickup_start_time,
        pickup_end_time=order_data.pickup_end_time,
        delivery_start_time=order_data.delivery_start_time,
        delivery_end_time=order_data.delivery_end_time,
    )
    order = crud.create_order(session=db, order=order_data)

    orders = crud.get_all_orders(session=db)
    assert len(orders) >= 0


def test_set_order_status(db: Session):
    pickup_address = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    pickup_address = crud.add_address(session=db, address=pickup_address)
    delivery_address = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Polna",
        house_number="13",
        apartment_number="1",
    )
    delivery_address = crud.add_address(session=db, address=delivery_address)
    order_data = OrderCreate(
        pickup_address=pickup_address,
        delivery_address=delivery_address,
        recipient_phone_number="123456789",
        pickup_start_time="08:00",
        pickup_end_time="09:00",
        delivery_start_time="10:00",
        delivery_end_time="11:00",
    )

    my_uuid = uuid.uuid4()

    order_data = OrderBase(
        user_id=my_uuid,
        courier_id=None,
        pickup_address_id=pickup_address.id,
        delivery_address_id=delivery_address.id,
        status_id=None,
        recipient_phone_number=order_data.recipient_phone_number,
        pickup_start_time=order_data.pickup_start_time,
        pickup_end_time=order_data.pickup_end_time,
        delivery_start_time=order_data.delivery_start_time,
        delivery_end_time=order_data.delivery_end_time,
    )
    order = crud.create_order(session=db, order=order_data)
    status_data = StatusCreate(name="Test Status")
    status = crud.add_status(session=db, status=status_data)
    order = crud.set_order_status(session=db, order_id=order.id, status_id=status.id)
    assert order.status_id == status.id


def test_get_courier_by_phone_number(db: Session):
    # Najpierw utwórz adres, który będzie używany jako home_address_id
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)

    # Utwórz status, który będzie używany jako status_id
    status_data = StatusCreate(name="Test Status")
    status = crud.add_status(session=db, status=status_data)

    courier_phone_number = random_phone_number()
    # Utwórz dane kuriera
    courier_data = CourierBase(
        phone_number=courier_phone_number,
        name=random_lower_string(),
        surname=random_lower_string(),
        home_address_id=address.id,
        status_id=status.id,
    )

    # Utwórz kuriera w bazie danych
    courier = crud.create_courier(session=db, courier_to_create=courier_data)
    courier = crud.get_courier_by_phone_number(
        session=db, phone_number=courier_phone_number
    )
    assert courier.phone_number == courier_phone_number


def test_get_courier_by_id(db: Session):
    # Najpierw utwórz adres, który będzie używany jako home_address_id
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)

    # Utwórz status, który będzie używany jako status_id
    status_data = StatusCreate(name="Test Status")
    status = crud.add_status(session=db, status=status_data)

    # Utwórz dane kuriera
    courier_data = CourierBase(
        phone_number=random_phone_number(),
        name=random_lower_string(),
        surname=random_lower_string(),
        home_address_id=address.id,
        status_id=status.id,
    )

    # Utwórz kuriera w bazie danych
    courier = crud.create_courier(session=db, courier_to_create=courier_data)
    courier_by_id = crud.get_courier_by_id(session=db, courier_id=courier.id)
    assert courier is not None
    assert courier.id == courier_by_id.id


def test_create_courier(db: Session):
    # Najpierw utwórz adres, który będzie używany jako home_address_id
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)

    # Utwórz status, który będzie używany jako status_id
    status_data = StatusCreate(name="Test Status")
    status = crud.add_status(session=db, status=status_data)

    # Utwórz dane kuriera
    courier_data = CourierBase(
        phone_number=random_phone_number(),
        name=random_lower_string(),
        surname=random_lower_string(),
        home_address_id=address.id,
        status_id=status.id,
    )

    # Utwórz kuriera w bazie danych
    courier = crud.create_courier(session=db, courier_to_create=courier_data)

    # Sprawdź, czy dane kuriera są poprawne
    assert courier.phone_number == courier_data.phone_number
    assert courier.name == courier_data.name
    assert courier.surname == courier_data.surname
    assert courier.home_address_id == courier_data.home_address_id
    assert courier.status_id == courier_data.status_id


def test_set_courier_status(db: Session):
    # Najpierw utwórz adres, który będzie używany jako home_address_id
    address_data = AddressCreate(
        city="Warszawa",
        postal_code="00-665",
        street="Nowowiejska",
        house_number="15",
        apartment_number="19",
    )
    address = crud.add_address(session=db, address=address_data)

    # Utwórz status, który będzie używany jako status_id
    status_data = StatusCreate(name="Test Status")
    status = crud.add_status(session=db, status=status_data)

    # Utwórz dane kuriera
    courier_data = CourierBase(
        phone_number=random_phone_number(),
        name=random_lower_string(),
        surname=random_lower_string(),
        home_address_id=address.id,
        status_id=status.id,
    )

    # Utwórz kuriera w bazie danych
    courier = crud.create_courier(session=db, courier_to_create=courier_data)
    status_data = StatusCreate(name=random_lower_string())
    status = crud.add_status(session=db, status=status_data)
    crud.set_courier_status(session=db, courier_id=courier.id, status_id=status.id)
    courier = crud.get_courier_by_id(session=db, courier_id=courier.id)
    assert courier.status_id == status.id


def test_get_orders_by_user_id(db: Session):
    orders = crud.get_orders_by_user_id(session=db, user_id="1")
    assert orders is not None


def test_get_orders_by_courier_id(db: Session):
    orders = crud.get_orders_by_courier_id(session=db, courier_id="1")
    assert orders is not None


def test_set_order_courier_id(db: Session):
    order_data = OrderBase(
        user_id="1",
        pickup_address_id="1",
        delivery_address_id="2",
        pickup_start_time="08:00",
        pickup_end_time="09:00",
        delivery_start_time="10:00",
        delivery_end_time="11:00",
    )
    order = crud.create_order(session=db, order=order_data)
    courier_data = CourierBase(phone_number="123456789", name="Test", surname="Courier")
    courier = crud.create_courier(session=db, courier=courier_data)
    order = crud.set_order_courier_id(
        session=db, order_id=order.id, courier_id=courier.id
    )
    assert order.courier_id == courier.id


def test_get_all_couriers(db: Session):
    couriers = crud.get_all_couriers(session=db)
    assert couriers is not None


def test_get_current_location(db: Session):
    location = crud.get_current_location(session=db, courier_id="1")
    assert location is not None


def test_get_courier_bu_id(db: Session):
    courier = crud.get_courier_by_id(session=db, courier_id="1")
    assert courier is not None


def test_get_courier_current_location(db: Session):
    location = crud.get_courier_current_location(session=db, courier_id="1")
    assert location is not None


def test_get_all_working_couriers(db: Session):
    couriers = crud.get_all_working_couriers(session=db)
    assert couriers is not None


def test_get_all_unstarted_orders(db: Session):
    orders = crud.get_all_unstarted_orders(session=db)
    assert orders is not None


def test_get_admin(db: Session):
    admin = crud.get_admin(session=db)
    assert admin.phone_number == settings.ADMIN_PHONE_NUMBER
    assert verify_password(settings.ADMIN_PASSWORD, admin.hashed_password)
