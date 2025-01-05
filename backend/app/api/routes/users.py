# all endpoints related to users
from fastapi import APIRouter, HTTPException
from typing import Any

from app.models import UserPublic, UserRegister, UserCreate, UserChangePassword
from app.api.dependecies import SessionDep
from app import crud

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=UserPublic)
def register_user(session: SessionDep, user_in: UserRegister) -> Any:
    user = crud.get_user_by_phone_number(
        session=session, phone_number=user_in.phone_number
    )
    if user:
        raise HTTPException(
            status_code=400,
            detail="User with given phone number already exists in the system",
        )
    user_to_create = UserCreate.model_validate(user_in)
    user = crud.create_user(session=session, user_to_create=user_to_create)
    return user


@router.post("/change_password")
def change_password(session: SessionDep, user_change_in: UserChangePassword) -> Any:
    user = crud.change_password(
        session=session,
        phone_number=user_change_in.phone_number,
        new_password=user_change_in.new_password,
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"msg": "Password changed successfully"}
