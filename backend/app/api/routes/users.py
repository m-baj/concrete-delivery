# all endpoints related to users
from fastapi import APIRouter, HTTPException
from typing import Any

from app.models import UserPublic, UserRegister, UserCreate
from app.api.dependecies import SessionDep
from app import crud

router = APIRouter(prefix="/users" ,tags=["users"])

@router.post("/register", response_model=UserPublic)
def register_user(session: SessionDep, user_in: UserRegister) -> Any:
    user = crud.get_user_by_phone_number(session=session, phone_number=user_in.phone_number)
    if user:
        raise HTTPException (
            status_code=400,
            detail="User with given phone number already exists in the system"
        )
    user_to_create = UserCreate.model_validate(user_in)
    user = crud.create_user(session=session, user_to_create=user_to_create)
    return user

