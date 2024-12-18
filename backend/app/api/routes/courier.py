from fastapi import APIRouter, HTTPException
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

@router.get("/{courier_id}/current_location", tags=["courier"], response_model=LocationAPI)
async def get_courier_current_location(courier_id: int):
    """
    Endpoint to get the current location of a courier based on the IS_AT relationship.
    """
    try:
        courier = Courier.nodes.get(courierID=courier_id)
        current_location = courier.location.single()  # Get current location from IS_AT

        if not current_location:
            raise HTTPException(status_code=404, detail="Courier's current location not found.")

        return LocationAPI(
            locationID=current_location.locationID,
            address=current_location.address,
            coordinates=current_location.coordinates.get("coordinates", []),
        )
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")


@router.get("/{courier_id}/locations_in_order", tags=["courier"], response_model=LocationsAPI)
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


@router.post("/{courier_id}/add_locations", tags=["courier"], response_model=AddLocationsRequest)
async def add_deliveries_to_courier(courier_id: int, request: AddLocationsRequest):
    """
    Endpoint to add a list of locations to a courier and connect them via the NEXT relationship.
    """
    try:
        courier = Courier.nodes.get(courierID=courier_id)
        previous_location = None
        for loc in request.locations:
            location, _ = Location.get_or_create((
                {
                    "locationID": loc.locationID,
                    "address": loc.address,
                    "coordinates": NeomodelPoint(loc.coordinates)
                },
            ))
            if previous_location:
                previous_location.next_location.connect(location)

            previous_location = location

        return LocationsAPI(locations=request.locations)

    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Courier not found")