from typing import List, Optional
from pydantic import BaseModel


#Response model for location
class LocationAPI(BaseModel):
    locationID: str
    address: str
    coordinates: List[float]
    order_type: str
    orderID: str
    next_location: Optional[int] = None

#Response model for list of locations
class LocationsAPI(BaseModel):
    locations: List[LocationAPI]

#Response model for courier
class CourierAPI(BaseModel):
    courierID: str
    name: str
    current_location: LocationAPI
    deliveries: List[LocationAPI]

#Request model for adding locations to a courier
class AddLocationsRequest(BaseModel):
    locations: List[LocationAPI]
    
#Request model for creating a courier
# class CreateCourierRequest(BaseModel):
#     courierID: str
#     name: str
#     current_location: LocationAPI
#     deliveries: List[LocationAPI]