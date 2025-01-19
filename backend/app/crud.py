from sqlmodel import Session, select
from typing import Tuple, List, Dict

from app.models import (
    Courier as CourierPostgres,
    User,
    UserCreate,
    UserRegister,
    UserBase,
    UserCourierCreate,
    UserPublic,
    Address,
    AddressCreate,
    AddressBase,
    AddressPublic,
    Status,
    StatusCreate,
    StatusBase,
    Order,
    AccountType,
    OrderBase,
    OrderCreate,
    OrderPublic,
    CourierBase,
    CourierRegister,
    Courier,
    CourierPublic,
    UserChangePassword,
    SendCodeRequest,
    VerifyCodeRequest,
    CourierUpdate,
)
from app.utils.vroom.models import VroomVehicle, VroomJob, Shipment, Pickup, Delivery
from app.core.security import get_password_hash, verify_password
from app.utils.geocoding import get_coordinates

# from .crud_neo4j import get_courier_current_location
from app.models_neo4j import Courier, Location
from .utils.hour import hour_from_str_to_timestamp
from .utils.vroom.models import PICKUP_VROOMJOB_OFFSET, DELIVERY_VROOMJOB_OFFSET


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


def get_user_by_courier_id(*, session: Session, courier_id: str) -> User | None:
    query = select(User).where(User.courier_id == courier_id)
    user = session.exec(query).first()
    return user


def get_user_by_id(*, session: Session, user_id: str) -> User | None:
    query = select(User).where(User.id == user_id)
    user = session.exec(query).first()
    return user


def change_password(
    *, session: Session, phone_number: str, new_password: str
) -> User | None:
    user = get_user_by_phone_number(session=session, phone_number=phone_number)
    if not user:
        return None
    user.hashed_password = get_password_hash(new_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def change_user_phone_number(
    *, session: Session, user_id: str, new_phone_number: str
) -> User | None:
    user = get_user_by_id(session=session, user_id=user_id)
    if not user:
        return None
    if get_user_by_phone_number(session=session, phone_number=new_phone_number):
        raise ValueError("User with this phone number already exists")
    user.phone_number = new_phone_number
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def authenticate(*, session: Session, phone_number: str, password: str) -> User | None:
    user = get_user_by_phone_number(session=session, phone_number=phone_number)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def add_address(*, session: Session, address: AddressCreate) -> Address:
    X, Y = get_coordinates(f"{address.city}, {address.street} {address.house_number}")
    db_obj = Address(
        city=address.city,
        postal_code=address.postal_code,
        street=address.street,
        house_number=address.house_number,
        apartment_number=address.apartment_number,
        X_coordinate=round(X, 5),
        Y_coordinate=round(Y, 5)
    )
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


def get_address_by_coordinates(
    *, session: Session, x: float, y: float
) -> Address | None:
    query = select(Address).where(Address.X_coordinate == x, Address.Y_coordinate == y)
    address = session.exec(query).first()
    return address


def update_X_coordinate(
    *, session: Session, address_id: str, new_X: str
) -> Address | None:
    query = select(Address).where(Address.id == address_id)
    address = session.exec(query).first()
    if address:
        address.X_coordinate = new_X
        session.add(address)
        session.commit()
        session.refresh(address)
    return address


def update_Y_coordinate(
    *, session: Session, address_id: str, new_Y: str
) -> Address | None:
    query = select(Address).where(Address.id == address_id)
    address = session.exec(query).first()
    if address:
        address.Y_coordinate = new_Y
        session.add(address)
        session.commit()
        session.refresh(address)
    return address


def get_status(*, session: Session, status_id: str) -> Status | None:
    query = select(Status).where(Status.id == status_id)
    status = session.exec(query).first()
    return status


def get_status_by_name(*, session: Session, status_name: str) -> Status | None:
    query = select(Status).where(Status.name == status_name)
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


def assign_courier_to_order(
    *, session: Session, order_id: str, courier_id: str
) -> Order | None:
    query = select(Order).where(Order.id == order_id)
    order = session.exec(query).first()
    if order:
        order.courier_id = courier_id
        session.add(order)
        session.commit()
        session.refresh(order)
    return order


def get_order_by_id(*, session: Session, order_id: str) -> Order | None:
    query = select(Order).where(Order.id == order_id)
    order = session.exec(query).first()
    return order


def get_all_orders(*, session: Session) -> list[Order]:
    query = select(Order)
    orders = session.exec(query).all()
    return orders


def set_order_status(
    *, session: Session, order_id: str, status_id: str
) -> Order | None:
    query = select(Order).where(Order.id == order_id)
    order = session.exec(query).first()
    if order:
        order.status_id = status_id
        session.add(order)
        session.commit()
        session.refresh(order)
    return order


def get_courier_by_phone_number(
    *, session: Session, phone_number: str
) -> CourierPostgres | None:
    query = select(CourierPostgres).where(CourierPostgres.phone_number == phone_number)
    courier = session.exec(query).first()
    return courier


def get_courier_by_id(*, session: Session, courier_id: str) -> CourierPostgres | None:
    query = select(CourierPostgres).where(CourierPostgres.id == courier_id)
    courier = session.exec(query).first()
    return courier


def delete_courier_by_id(
    *, session: Session, courier_id: str
) -> CourierPostgres | None:
    query = select(CourierPostgres).where(CourierPostgres.id == courier_id)
    courier = session.exec(query).first()
    if courier:
        session.delete(courier)
        session.commit()
    return courier


def update_courier_by_id(
    *, session: Session, courier_id: str, courier_update: CourierUpdate
) -> CourierPostgres | None:
    query = select(CourierPostgres).where(CourierPostgres.id == courier_id)
    courier = session.exec(query).first()
    if courier:
        courier.name = courier_update.name
        courier.surname = courier_update.surname
        courier.phone_number = courier_update.phone_number
        courier.home_address_id = courier_update.home_address_id
        courier.status_id = courier_update.status_id
        session.add(courier)
        session.commit()
        session.refresh(courier)
    return courier


def get_courier_id_by_user_id(session: Session, user_id: str) -> str | None:
    query = select(User).where(User.id == user_id)
    user = session.exec(query).first()
    return user.courier_id


def create_courier(
    *, session: Session, courier_to_create: CourierBase
) -> CourierPostgres:
    db_obj = CourierPostgres.model_validate(courier_to_create)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def set_courier_status(
    *, session: Session, courier_id: str, status_id: str
) -> CourierPostgres | None:
    query = select(CourierPostgres).where(Courier.id == courier_id)
    courier = session.exec(query).first()
    if courier:
        courier.status_id = status_id
        session.add(courier)
        session.commit()
        session.refresh(courier)
    return courier


def set_courier_status_by_name(
    *, session: Session, courier_id: str, status_name: str
) -> CourierPostgres | None:
    query = select(CourierPostgres).where(Courier.id == courier_id)
    courier = session.exec(query).first()
    if courier:
        status = get_status_by_name(session=session, status_name=status_name)
        courier.status_id = status.id
        session.add(courier)
        session.commit()
        session.refresh(courier)
    return courier


def get_orders_by_user_id(*, session: Session, user_id: str) -> list[Order]:
    query = select(Order).where(Order.user_id == user_id)
    orders = session.exec(query).all()
    return orders


def get_orders_by_courier_id(*, session: Session, courier_id: str) -> list[Order]:
    query = select(Order).where(Order.courier_id == courier_id)
    orders = session.exec(query).all()
    return orders


def set_order_courier_id(
    *, session: Session, order_id: str, courier_id: str
) -> Order | None:
    query = select(Order).where(Order.id == order_id)
    order = session.exec(query).first()
    if order:
        order.courier_id = courier_id
        session.add(order)
        session.commit()
        session.refresh(order)
    return order


def get_all_couriers(*, session: Session) -> list[CourierPostgres]:
    query = select(CourierPostgres)
    couriers = session.exec(query).all()
    return couriers


# Neo4j
def get_current_location(courier: Courier) -> Location:
    return courier.is_at.single()


def get_courier_by_id_neo_4j(courier_id: str) -> Courier:
    try:
        return Courier.nodes.get(courierID=courier_id)
    except DoesNotExist:
        return None


def get_courier_current_location(courierID: str) -> List[float]:
    courier = get_courier_by_id_neo_4j(courierID)
    print(courier)
    return get_current_location(courier).coordinates


def get_all_working_couriers(
    *, session: Session
) -> Tuple[List[VroomVehicle], Dict[int, str]]:
    couriers = get_all_couriers(session=session)
    couriers_as_vehicles = []
    vroomvehicle_id_dict = {}
    for index, courier in enumerate(couriers):
        vroomvehicle_id_dict[index] = courier.id
        home_address = get_address_by_id(
            session=session, address_id=courier.home_address_id
        )
        courier_as_vehicle = VroomVehicle(
            id=index,
            description=f"{courier.name} {courier.surname}, {courier.phone_number}",
            start=get_courier_current_location(courierID=courier.id),
            end=[home_address.X_coordinate, home_address.Y_coordinate],
            time_window=[
                hour_from_str_to_timestamp("08:00"),
                hour_from_str_to_timestamp("16:00"),
            ],  # TODO: get working hours from courier, by adding working_hours field to Courier model in database
        )
        couriers_as_vehicles.append(courier_as_vehicle)
    return couriers_as_vehicles, vroomvehicle_id_dict


def get_all_unstarted_orders(
    *, session: Session
) -> Tuple[List[Shipment], VroomJob, Dict[int, str]]:
    shipments = []
    jobs = []
    orders = get_all_orders(session=session)
    vroomjobs_id_dict = {}
    for index, order in enumerate(orders, start=2):
        order_status_name = get_status(session=session, status_id=order.status_id).name
        if order_status_name == "Order accepted":
            vroomjobs_id_dict[f"{index}{PICKUP_VROOMJOB_OFFSET}"] = order.id
            vroomjobs_id_dict[f"{index}{DELIVERY_VROOMJOB_OFFSET}"] = order.id
            pickup_address = get_address_by_id(
                session=session, address_id=order.pickup_address_id
            )
            delivery_address = get_address_by_id(
                session=session, address_id=order.delivery_address_id
            )

            # Dodanie VroomJob dla lokalizacji odbioru
            pickup = Pickup(
                id=int(f"{index}{PICKUP_VROOMJOB_OFFSET}"),
                description=f"{order.id}",
                location=[pickup_address.X_coordinate, pickup_address.Y_coordinate],
                time_window=[
                    hour_from_str_to_timestamp(order.pickup_start_time),
                    hour_from_str_to_timestamp(order.pickup_end_time),
                ],
            )

            delivery = Delivery(
                id=int(f"{index}{DELIVERY_VROOMJOB_OFFSET}"),
                description=f"{order.id}",
                location=[delivery_address.X_coordinate, delivery_address.Y_coordinate],
                time_window=[
                    hour_from_str_to_timestamp(order.delivery_start_time),
                    hour_from_str_to_timestamp(order.delivery_end_time),
                ],
            )
            shipments.append(Shipment(pickup=pickup, delivery=delivery))

        if (
            order_status_name == "Picking up order"
            or order_status_name == "Order picked up"
        ):
            vroomjobs_id_dict[f"{index}{DELIVERY_VROOMJOB_OFFSET}"] = order.id
            pickup_address = get_address_by_id(
                session=session, address_id=order.delivery_address_id
            )

            # Dodanie VroomJob dla lokalizacji dostawy
            
            job = DeliveryJob(
                    id=int(f"{index}{DELIVERY_VROOMJOB_OFFSET}"),
                    description=f"{order.id}",
                    location=[
                        pickup_address.X_coordinate,
                        pickup_address.Y_coordinate,
                    ],
                    time_window=[
                        hour_from_str_to_timestamp(order.delivery_start_time),
                        hour_from_str_to_timestamp(order.delivery_end_time),
                    ],
                )
            jobs.append(job)
            
    return shipments, jobs, vroomjobs_id_dict


def get_admin(*, session: Session) -> User | None:
    query = select(User).where(User.account_type == AccountType.ADMIN)
    user = session.exec(query).first()
    return user
