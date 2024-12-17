from fastapi import APIRouter, HTTPException
from backend.app.services_neo4j import get_current_location, get_assigned_locations_in_order

router = APIRouter()

# Route to get the current location of a courier
@router.get("/couriers/{courier_id}/current_location", tags=["Neo4j"])
async def current_location_route(courier_id: int):
    """
    Get the current location of a courier based on IS_AT relationship.
    """
    current_location = await get_current_location(courier_id)
    if not current_location:
        raise HTTPException(status_code=404, detail="Courier not found or has no current location.")
    return {
        "courier_id": courier_id,
        "current_location": {
            "locationID": current_location.locationID,
            "address": current_location.address,
            "coordinates": current_location.coordinates,
        },
    }


# Route to get locations assigned to a courier in order
@router.get("/couriers/{courier_id}/locations_in_order", tags=["Neo4j"])
async def locations_in_order_route(courier_id: int):
    """
    Get all locations assigned to a courier in order based on THEN relationship.
    """
    locations = await get_assigned_locations_in_order(courier_id)
    if locations is None:
        raise HTTPException(status_code=404, detail="Courier not found or has no assigned locations.")
    elif not locations:
        return {"courier_id": courier_id, "locations": []}

    formatted_locations = [
        {
            "locationID": location.locationID,
            "address": location.address,
            "coordinates": location.coordinates,
        }
        for location in locations
    ]
    return {
        "courier_id": courier_id,
        "locations_in_order": formatted_locations,
    }
