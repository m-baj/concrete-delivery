from fastapi import APIRouter, HTTPException, Depends
from typing import Any
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models import OrderPublic, OrderCreate, Order, OrderBase
from app.api.dependecies import SessionDep
from app import crud
from app.api.dependecies import CurrentUser
from app.api.routes.address import add_address

router = APIRouter(prefix="/order", tags=["order"])


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
        pickup_start_time=order.pickup_start_time,
        pickup_end_time=order.pickup_end_time,
        delivery_start_time=order.delivery_start_time,
        delivery_end_time=order.delivery_end_time,
    )

    db_order = crud.create_order(session=session, order=order_data)
    crud.set_order_status(
        session=session,
        order_id=db_order.id,
        status_id="60797806-3483-4bc6-81cc-9ec718cb23be",
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
