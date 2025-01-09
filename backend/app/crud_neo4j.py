from neomodel import DoesNotExist
from sqlmodel import Session
from app.models_neo4j import Courier, Location
from app.crud import get_address_by_coordinates
from typing import List


def get_courier_by_id(courier_id: str) -> Courier:
    try:
        return Courier.nodes.get(courierID=courier_id)
    except DoesNotExist:
        return None


def create_courier(courier_id: str, name: str) -> Courier:
    return Courier(courierID=courier_id, name=name).save()

def get_location_by_id(location_id: str) -> Location:
    return Location.nodes.get_or_none(locationID=location_id)

def create_location(location_id: str, address: str, coordinates: List[float]) -> Location:
    return Location(locationID=location_id, address=address, coordinates=coordinates).save()

def disconnect_all_delivers_to(courier: Courier):
    for location in courier.delivers_to.all():
        courier.delivers_to.disconnect(location)


def connect_delivers_to(courier: Courier, location: Location):
    courier.delivers_to.connect(location)


def connect_next_location(previous_location: Location, next_location: Location):
    previous_location.next_location.connect(next_location)


def get_current_location(courier: Courier) -> Location:
    return courier.is_at.single()


def disconnect_current_location(courier: Courier, current_location: Location):
    courier.is_at.disconnect(current_location)


def connect_current_location(courier: Courier, new_location: Location):
    courier.is_at.connect(new_location)

def write_locations_to_courier(session: Session, courierID: str, locations: List[List[float]]):
    courier = get_courier_by_id(courierID)
    if not courier:
        raise Exception(f"There is no courier with ID: {courierID}!")
    existing_delivers_to = courier.delivers_to.all()
    locations_objects = []
    print(locations)
    for location in locations:
        address = get_address_by_coordinates(session=session, x=location[0], y=location[1])
        if address:
            location_object = get_location_by_id(address.id)
            if not location_object:
                location_object = create_location(
                    location_id=str(address.id),
                    address=f"{address.street} {address.house_number}, {address.city}",
                    coordinates=[address.X_coordinate, address.Y_coordinate]
                )
        else:
            raise Exception("There is no address with these coordinates in the database!")
        locations_objects.append(location_object)

    if existing_delivers_to:
        last_existing_location = existing_delivers_to[-1]
        connect_next_location(last_existing_location, locations_objects[0])
    else:
        connect_delivers_to(courier, locations_objects[0])

    previous_location = locations_objects[0]
    for location in locations_objects[1:]:
        connect_next_location(previous_location, location)
        previous_location = location


def get_courier_current_location(courierID: str) -> List[float]:
    courier = get_courier_by_id(courierID)
    print(courier)
    return get_current_location(courier).coordinates
