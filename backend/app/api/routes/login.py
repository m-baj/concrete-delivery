# all endpoints related to loging in
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from datetime import timedelta

from app import crud
from app.api.dependecies import SessionDep
from app.core.security import create_access_token
from app.core.config import settings
from app.models import Token

router = APIRouter(tags=["login"])


@router.post("/login")
def login(
    session: SessionDep, data_form: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    user = crud.authenticate(
        session=session, phone_number=data_form.username, password=data_form.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect phone number or password",
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user.id, access_token_expires)
    return Token(access_token=access_token, token_type="bearer")
