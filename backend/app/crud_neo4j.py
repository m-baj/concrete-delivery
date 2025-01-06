from neomodel import DoesNotExist
from .models_neo4j import Courier, Location

def get_courier_by_id(courier_id: str) -> Courier:
    try:
        return Courier.nodes.get(courierID=courier_id)
    except DoesNotExist:
        return None

def create_courier(courier_id: str, name: str) -> Courier:
    return Courier(courierID=courier_id, name=name).save()

def get_location_by_id(location_id: int) -> Location:
    return Location.nodes.get_or_none(locationID=location_id)

def create_location(location_id: int, address: str, coordinates: list) -> Location:
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

def write_locations_to_courier(courierID: str, locations: list[Location]):
    courier = get_courier_by_id(courierID)
    existing_delivers_to = courier.delivers_to.all()

    if existing_delivers_to:
        last_existing_location = existing_delivers_to[-1]
        connect_next_location(last_existing_location, locations[0])
    else:
        connect_delivers_to(courier, locations[0])

    previous_location = locations[0]
    for location in locations[1:]:
        connect_next_location(previous_location, location)
        previous_location = location