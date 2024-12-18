from models_neo4j import Courier, Location, IsAt, Then, DeliversTo
from neontology import Point

async def get_current_location(courier_id: int):
    """
    Returns the current location of a courier based on the IS_AT relationship.
    """
    courier = await Courier.nodes.get_or_none(courierID=courier_id)
    if not courier:
        return None

    current_location = await courier.outgoing(IsAt).first()
    return current_location


async def get_assigned_locations_in_order(courier_id: int):
    """
    Returns all locations assigned to a courier in order based on the THEN relationship.
    """
    courier = await Courier.nodes.get_or_none(courierID=courier_id)
    if not courier:
        return None

    starting_location = await courier.outgoing("DELIVERS_TO").first()

    if not starting_location:
        return []

    ordered_locations = []
    current_location = starting_location

    while current_location:
        ordered_locations.append(current_location)
        current_location = await current_location.outgoing(Then).first()

    return ordered_locations

async def add_locations_to_courier(courier_id: int, locations_data: list[dict]):
    """
    Add a list of locations to a given courier in order
    """
    courier = await Courier.nodes.get_or_none(courierID=courier_id)
    if not courier:
        return None, "Courier not found."

    previous_location = None
    created_locations = []

    for i, loc_data in enumerate(locations_data):
        location = await Location.create(
            locationID = loc_data["locationID"],
            address = loc_data.get("address"),
            coordinates = Point(loc_data["coordinates"]),
        )

        created_locations.append(location)

        if i == 0:
            # First location connects to courier with a DeliversTo relationship
            await courier.relationships.create(location, DeliversTo)
        else:
            # Next locations connect to the previous location with a Then relationship
            await previous_location.relationships.create(location, Then)

        previous_location = location

    return created_locations, None