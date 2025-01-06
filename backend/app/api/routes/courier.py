from fastapi import APIRouter, HTTPException
from typing import Any

# PostgreSQL queries
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

# Neo4j queries
from neomodel import DoesNotExist
from app.models_neo4j import Courier, Location
from app.api_models_neo4j import (
    LocationAPI,
    LocationsAPI,
    CourierAPI,
    AddLocationsRequest,
)

from app.crud_neo4j import get_courier_by_id, get_location_by_id, create_location, write_locations_to_courier

router = APIRouter(prefix="/courier", tags=["courier"])


@router.post("/register", response_model=CourierPublic)
def register_courier(
    session: SessionDep, current_user: CurrentAdmin, courier_in: CourierRegister
) -> Any:
    """
    Create a courier only if currently logged in user is an admin
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

    # Automatically adding the courier to neo4j
    neo4j_courier = Courier(
        courierID=courier.id,
        name=courier_in.name
    ).save()

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


@router.get(
    "/{courier_id}/current_location", tags=["courier"], response_model=LocationAPI
)
async def get_courier_current_location(courier_id: str):
    """
    Endpoint to get the current location of a courier based on the IS_AT relationship.
    """
    try:
        courier = Courier.nodes.get(courierID=courier_id)
        current_location = courier.is_at.single()  # Get current location from IS_AT

        if not current_location:
            raise HTTPException(
                status_code=404, detail="Courier's current location not found."
            )

        return LocationAPI(
            locationID=current_location.locationID,
            address=current_location.address,
            coordinates=current_location.coordinates,
        )
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.post("/{courier_id}/set_current_location", tags=["courier"], response_model=LocationAPI)
async def set_current_location(courier_id: str, request: LocationAPI):
    """
    Endpoint to set the current location of a courier based on the IS_AT relationship
    """
    try:
        courier = Courier.nodes.get(courierID=courier_id)

        current_location = courier.is_at.single()
        if current_location:
            courier.is_at.disconnect(current_location)

        new_location = Location.nodes.get_or_none(locationID=request.locationID)
        if not new_location:
            new_location = Location(
                locationID=request.locationID,
                address=request.address,
                coordinates=request.coordinates,
            ).save()

        courier.is_at.connect(new_location)

        return LocationAPI(
            locationID=new_location.locationID,
            address=new_location.address,
            coordinates=new_location.coordinates,
        )
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.get(
    "/{courier_id}/locations_in_order", tags=["courier"], response_model=LocationsAPI
)
async def get_courier_deliveries_in_order(courier_id: str):
    """
    Endpoint to get the list of locations in order of delivery for a courier based on the DELIVERS_TO and NEXT relationships
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
                        coordinates=loc.coordinates,
                        next_location=loc.next_location.single().locationID if loc.next_location.single() else None,
                    )
                )
                loc = loc.next_location.single()
            locations.extend(delivery_chain)

        return LocationsAPI(locations=locations)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.post("/{courier_id}/add_locations", tags=["courier"], response_model=AddLocationsRequest)
async def add_deliveries_to_courier(courier_id: str, request: AddLocationsRequest):
    courier = get_courier_by_id(courier_id)
    if not courier:
        raise HTTPException(status_code=404, detail="Courier not found")

    locations = []
    for loc in request.locations:
        location = get_location_by_id(loc.locationID)
        if not location:
            location = create_location(
                location_id=loc.locationID,
                address=loc.address,
                coordinates=loc.coordinates,
            )
        locations.append(location)

    write_locations_to_courier(courier_id, locations)

    return LocationsAPI(locations=request.locations)


@router.post("/{courier_id}/package_delivered", tags=["courier"])
async def package_delivered(courier_id: str):
    """
    Endpoint to update the courier's location upon delivering previously assigned package
    """
    try:
        courier = Courier.nodes.get(courierID=courier_id)
        current_location = courier.is_at.single()
        next_location = courier.delivers_to.single()

        if not next_location:
            raise HTTPException(status_code=404, detail="No next delivery location found")

        courier.is_at.disconnect(current_location)
        courier.is_at.connect(next_location)

        next_next_location = next_location.next_location.single()
        courier.delivers_to.disconnect(next_location)
        if next_next_location:
            courier.delivers_to.connect(next_next_location)
            next_location.next_location.disconnect(next_next_location)

        if not next_location.is_visited_by and not next_location.delivered_by and not next_location.next_location:
            next_location.delete()

        return {"message": "Package delivered and courier location updated"}

    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.get("/all_couriers", response_model=list[CourierPublic])
def get_all_couriers(session: SessionDep, current_user: CurrentAdmin) -> Any:
    """
    Get all couriers
    """
    if current_user.account_type != AccountType.ADMIN:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    couriers = crud.get_all_couriers(session=session)
    return couriers


@router.get("/home_address/{courier_id}")
def get_courier_home_address(session: SessionDep, courier_id: str) -> Any:
    """
    Get the home address of a courier
    """
    courier = crud.get_courier_by_id(session=session, courier_id=courier_id)
    if not courier:
        raise HTTPException(status_code=404, detail="Courier not found")
    home_address = crud.get_address_by_id(
        session=session, address_id=courier.home_address_id
    )
    return home_address


@router.get("/complex/{courier_id}")
def get_courier_complex(session: SessionDep, courier_id: str) -> Any:
    """
    Get the home address of a courier
    """
    courier = crud.get_courier_by_id(session=session, courier_id=courier_id)
    if not courier:
        raise HTTPException(status_code=404, detail="Courier not found")
    home_address = crud.get_address_by_id(
        session=session, address_id=courier.home_address_id
    )
    status = crud.get_status(session=session, status_id=courier.status_id)
    return_data = {
        "id": courier.id,
        "name": courier.name,
        "surname": courier.surname,
        "phoneNumber": courier.phone_number,
        "status": status.name,
        "homeAddress": {
            "city": home_address.city,
            "street": home_address.street,
            "postalCode": home_address.postal_code,
            "houseNumber": home_address.house_number,
            "apartmentNumber": home_address.apartment_number,
        },
    }
    return return_data


@router.get("/complex_all")
def get_all_couriers_complex(session: SessionDep) -> Any:
    """
    Get list of complex courier data
    """
    couriers = crud.get_all_couriers(session=session)
    return_data = []
    for courier in couriers:
        home_address = crud.get_address_by_id(
            session=session, address_id=courier.home_address_id
        )
        status = crud.get_status(session=session, status_id=courier.status_id)
        return_data.append(
            {
                "id": courier.id,
                "name": courier.name,
                "surname": courier.surname,
                "phoneNumber": courier.phone_number,
                "status": status.name,
                "homeAddress": {
                    "city": home_address.city,
                    "street": home_address.street,
                    "postalCode": home_address.postal_code,
                    "houseNumber": home_address.house_number,
                    "apartmentNumber": home_address.apartment_number,
                },
            }
        )
    return return_data
