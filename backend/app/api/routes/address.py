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


@router.get("/{address_id}", response_model=AddressPublic)
def get_address(address_id: str, session: SessionDep) -> Any:
    address = crud.get_address_by_id(session=session, address_id=address_id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    return address


@router.delete("/{address_id}")
def delete_address(address_id: str, session: SessionDep) -> Any:
    address = crud.delete_address(session=session, address_id=address_id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    return address
