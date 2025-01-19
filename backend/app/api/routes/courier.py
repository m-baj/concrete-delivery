from fastapi import APIRouter, HTTPException
from typing import Any
import logging

# PostgreSQL queries
from app.models import (
    CourierPublic,
    CourierRegister,
    CourierBase,
    UserCourierCreate,
    AccountType,
    CourierUpdate,
    StatusCreate,
    User
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

from app.crud_neo4j import (
    get_courier_by_id,
    get_location_by_id,
    create_location,
    write_locations_to_courier,
    create_courier,
    get_courier_all_locations,
)

from app.crud import get_courier_id_by_user_id

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

    default_status = crud.get_status_by_name(session=session, status_name="Available")
    home_address = add_address(session=session, address=courier_in.home_address)
    courier_to_create_as_courier = CourierBase(
        name=courier_in.name,
        surname=courier_in.surname,
        phone_number=courier_in.phone_number,
        home_address_id=home_address.id,
        status_id=default_status.id,
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
    neo4j_courier = create_courier(
        courier.id, name=f"{courier_in.name} {courier_in.surname}"
    )
    # Upon creating courier automatically setting the courier's location to his home address
    home_location_coordinates = [home_address.X_coordinate, home_address.Y_coordinate]
    home_address_string = (
        f"{home_address.street} {home_address.house_number}, {home_address.city}"
    )
    home_location = create_location(
        home_address.id, home_address_string, home_location_coordinates
    )
    neo4j_courier.is_at.connect(home_location)
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


@router.put("/status_by_name/{courier_id}")
def set_courier_status_by_name(
    session: SessionDep, courier_id: str, status_name: str
) -> Any:
    """
    Set status of a courier by name
    """
    courier = crud.get_courier_by_id(session=session, courier_id=courier_id)
    if not courier:
        raise HTTPException(status_code=404, detail="Courier not found")
    courier = crud.set_courier_status_by_name(
        session=session, courier_id=courier_id, status_name=status_name
    )
    return courier


@router.get(
    "/current_location/{courier_id}", tags=["courier"], response_model=LocationAPI
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
            order_type=current_location.order_type,
            orderID=current_location.orderID,
        )
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.post(
    "/set_current_location/{courier_id}", tags=["courier"], response_model=LocationAPI
)
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
                order_type=request.order_type,
                orderID=request.orderID,
            ).save()

        courier.is_at.connect(new_location)

        return LocationAPI(
            locationID=new_location.locationID,
            address=new_location.address,
            coordinates=new_location.coordinates,
            order_type=new_location.order_type,
            orderID=new_location.orderID,
        )
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.get(
    "/locations_in_order/{courier_id}", tags=["courier"], response_model=LocationsAPI
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
                        next_location=(
                            loc.next_location.single().locationID
                            if loc.next_location.single()
                            else None
                        ),
                        order_type=loc.order_type,
                        orderID=loc.orderID,
                    )
                )
                loc = loc.next_location.single()
            locations.extend(delivery_chain)

        return LocationsAPI(locations=locations)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.post(
    "/add_locations/{courier_id}", tags=["courier"], response_model=AddLocationsRequest
)
async def add_deliveries_to_courier(
    courier_id: str, request: AddLocationsRequest, session: SessionDep
):
    courier = get_courier_by_id(courier_id)
    if not courier:
        raise HTTPException(status_code=404, detail="Courier not found")

    locations = []
    coordinates_list = []
    for loc in request.locations:
        location = get_location_by_id(loc.locationID)
        if not location:
            location = create_location(
                location_id=loc.locationID,
                address=loc.address,
                coordinates=loc.coordinates,
                order_type=loc.order_type,
                orderID=loc.orderID,
            )
        locations.append(location)
        coordinates_list.append(loc.coordinates)

    write_locations_to_courier(session, courier_id, coordinates_list)

    return LocationsAPI(locations=request.locations)


@router.post("/package_delivered/{courier_id}", tags=["courier"])
async def package_delivered(courier_id: str):
    """
    Endpoint to update the courier's location upon delivering previously assigned package
    """
    try:
        courier = Courier.nodes.get(courierID=courier_id)
        current_location = courier.is_at.single()
        next_location = courier.delivers_to.single()

        if not next_location:
            raise HTTPException(
                status_code=404, detail="No next delivery location found"
            )

        courier.is_at.disconnect(current_location)
        courier.is_at.connect(next_location)

        next_next_location = next_location.next_location.single()
        courier.delivers_to.disconnect(next_location)
        if next_next_location:
            courier.delivers_to.connect(next_next_location)
            next_location.next_location.disconnect(next_next_location)

        if (
            not next_location.is_visited_by
            and not next_location.delivered_by
            and not next_location.next_location
        ):
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


@router.get("/working")
def get_all_working_couriers(session: SessionDep) -> Any:
    """
    Get all working couriers
    """
    couriers = crud.get_all_working_couriers(session=session)
    return couriers


@router.get("/markers/{courier_id}")
def get_couriers_locations_list(courier_id: str):
    """
    Endpoint to get the list of ALL locations of a courier in order
    """
    try:
        locations = get_courier_all_locations(courier_id)
        markers = []

        for loc in locations:
            markers.append(
                {
                    "lat": loc.coordinates[0],
                    "lon": loc.coordinates[1],
                    "popup": loc.address,
                    "order_type": loc.order_type,
                    "orderID": loc.orderID,
                }
            )

        return markers

    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.get("/{user_id}")
def get_courier(user_id: str, session: SessionDep):
    courier_id = get_courier_id_by_user_id(session=session, user_id=user_id)
    if not courier_id:
        raise HTTPException(status_code=404, detail="Courier not found")
    return courier_id


@router.delete("/delete/{courier_id}")
def delete_courier(courier_id: str, session: SessionDep):
    courier = crud.get_courier_by_id(session=session, courier_id=courier_id)
    if not courier:
        raise HTTPException(status_code=404, detail="Courier not found")
    courier = crud.delete_courier_by_id(session=session, courier_id=courier_id)
    return courier


@router.put("/update")
def update_courier(session: SessionDep, courier_in: CourierUpdate):
    logger = logging.getLogger(__name__)
    logger.info(f"Received update request: {courier_in}")

    if (
        crud.get_courier_by_id(
            session=session, courier_id=str(courier_in.id)
        ).phone_number
        != courier_in.phone_number
    ):
        if crud.get_user_by_phone_number(
            session=session, phone_number=courier_in.phone_number
        ):
            raise HTTPException(
                status_code=400,
                detail="User with given phone number already exists in the system",
            )
        user = crud.get_user_by_courier_id(
            session=session, courier_id=str(courier_in.id)
        )
        crud.change_user_phone_number(
            session=session, user_id=user.id, new_phone_number=courier_in.phone_number
        )

    courier = crud.get_courier_by_id(session=session, courier_id=str(courier_in.id))
    if not courier:
        raise HTTPException(status_code=404, detail="Courier not found")

    if not crud.get_status_by_name(session=session, status_name=courier_in.status):
        new_status_create = StatusCreate(name=courier_in.status)
        new_status = crud.add_status(session=session, status=new_status_create)
    else:
        new_status = crud.get_status_by_name(
            session=session, status_name=courier_in.status
        )

    home_address = crud.add_address(session=session, address=courier_in.home_address)
    courier_update = CourierBase(
        name=courier_in.name,
        surname=courier_in.surname,
        phone_number=courier_in.phone_number,
        home_address_id=home_address.id,
        status_id=new_status.id,
    )
    updated_courier = crud.update_courier_by_id(
        session=session, courier_id=str(courier_in.id), courier_update=courier_update
    )

    if not updated_courier:
        raise HTTPException(status_code=500, detail="Failed to update courier")

    return {
        "message": "Courier updated successfully",
        "status": True,
        "updatedCourier": updated_courier,
    }

    user = session.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found")
    if not user.courier_id:
        raise HTTPException(status_code=404, detail=f"User with id {user_id} does not have a courier assigned")
    return user.courier_id

@router.get("/home_address/{courier_id}")
def get_courier_home_address(courier_id: str, session: SessionDep):
    courier = session.query(Courier).filter(Courier.id == courier_id).first()
    print(courier)
    print(courier_id)
    if not courier:
        raise HTTPException(status_code=404, detail=f"Courier with id {courier_id} not found")
    address = session.query(Address).filter(Address.id == courier.home_address_id).first()
    formatted_address = f"{address.street} {address.house_number}, {address.city}"
    return formatted_address