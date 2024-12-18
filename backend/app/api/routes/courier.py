from fastapi import APIRouter, HTTPException
from typing import Any

from app.models import (
    CourierPublic,
    CourierRegister,
    CourierBase,
    UserCourierCreate,
    AccountType,
)
from app.api.dependecies import SessionDep, CurrentAdmin
from app import crud
from app.api.routes.address import add_address

router = APIRouter(prefix="/courier", tags=["courier"])


@router.post("/register", response_model=CourierPublic)
def register_courier(
    session: SessionDep, current_user: CurrentAdmin, courier_in: CourierRegister
) -> Any:
    """
    create a courier only if currently logged in user is an admin
    """
    if current_user.account_type != AccountType.ADMIN:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    user = crud.get_user_by_phone_number(
        session=session, phone_number=courier_in.phone_number
    )
    if user:
        raise HTTPException(
            status_code=400,
            detail="User with given phone number already exists in the system",
        )
    courier = crud.get_courier_by_phone_number(
        session=session, phone_number=courier_in.phone_number
    )
    if courier:
        raise HTTPException(
            status_code=400,
            detail="Courier with given phone number already exists in the system",
        )

    home_address = add_address(session=session, address=courier_in.home_address)
    courier_to_create_as_courier = CourierBase(
        name=courier_in.name,
        surname=courier_in.surname,
        phone_number=courier_in.phone_number,
        home_address_id=home_address.id,
    )

    courier = crud.create_courier(
        session=session, courier_to_create=courier_to_create_as_courier
    )

    courier_to_create_as_user = UserCourierCreate(
        name=courier_in.name,
        surname=courier_in.surname,
        phone_number=courier_in.phone_number,
        email_address=courier_in.email_address,
        password=courier_in.password,
        courier_id=courier.id,
    )

    crud.create_user(session=session, user_to_create=courier_to_create_as_user)
    return courier
