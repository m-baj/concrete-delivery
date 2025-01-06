from fastapi import APIRouter, HTTPException, Depends
from typing import Any
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models import OrderPublic, OrderCreate, Order, OrderBase
from app.api.dependecies import SessionDep
from app import crud
from app.api.dependecies import CurrentUser
from app.api.routes.address import add_address
from app.services.twilio_service import TwilioService
from app.utils.vroom.vroom import Vroom
from app.utils.neo4j_updater import update_routes

router = APIRouter(prefix="/order", tags=["order"])
twilio_service = TwilioService()


@router.post("/", response_model=OrderPublic)
def create_order(
    session: SessionDep,
    current_user: CurrentUser,
    order: OrderCreate,
) -> Any:
    """
    Create an order for the currently logged in user
    """
    pickup_address = add_address(session=session, address=order.pickup_address)
    delivery_address = add_address(session=session, address=order.delivery_address)

    order_data = OrderBase(
        user_id=current_user.id,
        courier_id=None,
        pickup_address_id=pickup_address.id,
        delivery_address_id=delivery_address.id,
        status_id=None,
        recipient_phone_number=order.recipient_phone_number,
        pickup_start_time=order.pickup_start_time,
        pickup_end_time=order.pickup_end_time,
        delivery_start_time=order.delivery_start_time,
        delivery_end_time=order.delivery_end_time,
    )

    couriers, vroom_id_dict = crud.get_all_working_couriers(session=session)

    vroom = Vroom(working_couriers=couriers, orders=crud.get_all_unstarted_orders(session=session))
    vroom.find_route()

    if not vroom.verify_result():
        raise HTTPException(status_code=400, detail="Unable to accept order")
    
    order_accepted = crud.get_status_by_name(
        session=session, status_name="Order Accepted"
    )

    update_routes(optimization_result=vroom.optimization_result, vehicle_id_to_courier_id=vroom_id_dict)
    
    db_order = crud.create_order(session=session, order=order_data)
    crud.set_order_status(
        session=session,
        order_id=db_order.id,
        status_id=order_accepted.id,
    )
    return db_order


@router.put("/assign_courier/{order_id}")
def assign_courier_to_order(
    session: SessionDep,
    order_id: str,
    courier_id: str,
) -> Any:
    """
    Assign a courier to an order
    """
    order = crud.get_order_by_id(session=session, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order = crud.assign_courier_to_order(
        session=session, order_id=order_id, courier_id=courier_id
    )
    return order


@router.put("/status/{order_id}")
def set_order_status(
    session: SessionDep,
    order_id: str,
    status_id: str,
) -> Any:
    """
    Set status of an order
    """
    order = crud.get_order_by_id(session=session, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order = crud.set_order_status(
        session=session, order_id=order_id, status_id=status_id
    )
    user = crud.get_user_by_id(session=session, user_id=order.user_id)
    status = crud.get_status(session=session, status_id=status_id)
    message = f"Order {order_id} change the status to {status.name}"
    twilio_service.send_sms(phone_number=user.phone_number, message=message)
    twilio_service.send_sms(phone_number=order.recipient_phone_number, message=message)
    return order


@router.get("/user_orders/{user_id}")
def get_user_orders(
    session: SessionDep,
    user_id: str,
) -> Any:
    """
    Get all orders for a user
    """
    orders = crud.get_orders_by_user_id(session=session, user_id=user_id)
    return orders


@router.get("/courier_orders/{courier_id}")
def get_courier_orders(
    session: SessionDep,
    courier_id: str,
) -> Any:
    """
    Get all orders for a courier
    """
    orders = crud.get_orders_by_courier_id(session=session, courier_id=courier_id)
    return orders


@router.put("/set_courier_id/{order_id}")
def set_courier_id(
    session: SessionDep,
    order_id: str,
    courier_id: str,
) -> Any:
    """
    Set courier id for an order
    """
    order = crud.get_order_by_id(session=session, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order = crud.set_order_courier_id(
        session=session, order_id=order_id, courier_id=courier_id
    )
    return order


@router.get("/get_all_unstarted_orders_as_vroomJobs")
def get_all_unstarted_orders_as_vroomJobs(
    session: SessionDep,
) -> Any:
    """
    Get all unstarted orders as vroom jobs
    """
    orders = crud.get_all_unstarted_orders(session=session)
    return orders
