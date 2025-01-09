from geopy.geocoders import Nominatim
from pprint import pprint
from typing import Tuple

geolocator = Nominatim(user_agent="concrete_delivery")

def get_coordinates(address: str) -> Tuple[float, float]:
    location = geolocator.geocode(address)
    if location is None:
        raise ValueError(f"Could not find coordinates for {address}")
    return location.latitude, location.longitude

def get_address(coordinates: Tuple[float, float]) -> str:
    location = geolocator.reverse(coordinates)
    return location.address
