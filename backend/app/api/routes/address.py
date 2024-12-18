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


@router.delete("/{address_id}", response_model=AddressPublic)
def delete_address(address_id: str, session: SessionDep) -> Any:
    address = crud.delete_address(session=session, address_id=address_id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    return address


@router.put("/X/{address_id}", response_model=AddressPublic)
def update_X_coordinate(session: SessionDep, address_id: str, new_X: str) -> Any:
    address = crud.update_X_coordinate(
        session=session, address_id=address_id, new_X=new_X
    )
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    return address


@router.put("/Y/{address_id}", response_model=AddressPublic)
def update_Y_coordinate(session: SessionDep, address_id: str, new_Y: str) -> Any:
    address = crud.update_Y_coordinate(
        session=session, address_id=address_id, new_Y=new_Y
    )
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    return address
