from models_neo4j import Courier, Location, IsAt, Then

# Get the current location of a courier
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
