from fastapi import APIRouter, HTTPException
from typing import Any

from app.models import AddressPublic, AddressCreate
from app.api.dependecies import SessionDep
from app import crud

router = APIRouter(prefix="/address", tags=["address"])


@router.post("/", response_model=AddressPublic)
def add_address(session: SessionDep, address: AddressCreate) -> Any:
    existing_address = crud.get_address(session=session, address=address)
    if existing_address:
        return existing_address
    address = crud.add_address(session=session, address=address)
    return address
