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
        order_date=order.order_date,
    )

    db_order = crud.create_order(session=session, order=order_data)
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
