from email.policy import default

from fastapi import APIRouter, HTTPException
from backend.app.services_neo4j import (
    get_current_location,
    get_assigned_locations_in_order,
    add_locations_to_courier,
)

router = APIRouter()

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


@router.post("/couriers/{courier_id}/add_locations", tags=["Neo4j"])
async def add_locations_route(courier_id: int, locations_data: list[dict]):
    """
    Add a list of locations to a given courier in order.
    """
    if not locations_data:
        raise HTTPException(status_code=400, detail="No locations provided.")

    created_locations, error = await add_locations_to_courier(courier_id, locations_data)
    if error:
        raise HTTPException(status_code=404, detail=error)

    return {
        "courier_id": courier_id,
        "created_locations": [
            {
                "locationID": location.locationID,
                "address": location.address,
                "coordinates": location.coordinates,
            }
            for location in created_locations
        ],
    }