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

from neomodel import DoesNotExist
from neomodel.contrib.spatial_properties import NeomodelPoint
from app.models_neo4j import Courier, Location
from app.api_models_neo4j import (
    LocationAPI,
    LocationsAPI,
    CourierAPI,
    AddLocationsRequest,
    CreateCourierRequest,
)

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


@router.put("/status/{courier_id}")
def set_courier_status(session: SessionDep, courier_id: str, status_id: str) -> Any:
    """
    Set status of a courier
    """
    courier = crud.get_courier_by_id(session=session, courier_id=courier_id)
    if not courier:
        raise HTTPException(status_code=404, detail="Courier not found")
    courier = crud.set_courier_status(
        session=session, courier_id=courier_id, status_id=status_id
    )
    return courier


router = APIRouter(prefix="/courier", tags=["courier"])


@router.get(
    "/{courier_id}/current_location", tags=["courier"], response_model=LocationAPI
)
async def get_courier_current_location(courier_id: int):
    """
    Endpoint to get the current location of a courier based on the IS_AT relationship.
    """
    try:
        courier = Courier.nodes.get(courierID=courier_id)
        current_location = courier.location.single()  # Get current location from IS_AT

        if not current_location:
            raise HTTPException(
                status_code=404, detail="Courier's current location not found."
            )

        return LocationAPI(
            locationID=current_location.locationID,
            address=current_location.address,
            coordinates=current_location.coordinates.get("coordinates", []),
        )
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.get(
    "/{courier_id}/locations_in_order", tags=["courier"], response_model=LocationsAPI
)
async def get_courier_deliveries_in_order(courier_id: int):
    """
    Endpoint to get the list of delivery locations for a courier, in the order defined by the NEXT relationship.
    """
    try:
        courier = Courier.nodes.get(courierID=courier_id)
        deliveries = courier.delivers_to.all()
        locations = []
        for loc in deliveries:
            delivery_chain = []
            while loc:
                delivery_chain.append(
                    LocationAPI(
                        locationID=loc.locationID,
                        address=loc.address,
                        coordinates=loc.coordinates.get("coordinates", []),
                    )
                )
                loc = loc.next_location.single()
            locations.extend(delivery_chain)

        return LocationsAPI(locations=locations)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.post(
    "/{courier_id}/add_locations", tags=["courier"], response_model=AddLocationsRequest
)
async def add_deliveries_to_courier(courier_id: int, request: AddLocationsRequest):
    """
    Endpoint to add a list of locations to a courier and connect them via the NEXT relationship.
    """
    try:
        courier = Courier.nodes.get(courierID=courier_id)
        previous_location = None
        for loc in request.locations:
            location, _ = Location.get_or_create(
                (
                    {
                        "locationID": loc.locationID,
                        "address": loc.address,
                        "coordinates": NeomodelPoint(loc.coordinates),
                    },
                )
            )
            if previous_location:
                previous_location.next_location.connect(location)

            previous_location = location

        return LocationsAPI(locations=request.locations)

    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")
