import os

from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from app.services.map_service import create_map, get_osrm_route

router = APIRouter(tags=["map"])


@router.get("/map", response_class=HTMLResponse)
def get_map():
    markers = [
        (52.2297, 21.0122, "ul. Marszałkowska 10"),
        (52.2333, 21.0102, "ul. Marszałkowska 104"),
        (52.2404, 21.0169, "ul. Królewska 1"),
        (52.2385, 21.0144, "ul. Tadeusza Czackiego 21"),
    ]
    # markers = [(52.1997, 20.8822, "ul. Marszałkowska 10"),
    #              (52.2885, 21.2144, "ul. Tadeusza Czackiego 21"),
    #              (52.2333, 21.1102, "ul. Marszałkowska 104")]
    # latitude: float = 52.2297, longitude: float = 21.0122
    lat = 0
    lon = 0
    for marker in markers:
        lat += marker[0]
        lon += marker[1]
    lat = lat / len(markers)
    lon = lon / len(markers)

    lat_max = max([marker[0] for marker in markers])
    lat_min = min([marker[0] for marker in markers])
    lon_max = max([marker[1] for marker in markers])
    lon_min = min([marker[1] for marker in markers])
    # współczynniki sam znalazlem i dobrałem
    # zoom = -13.94*(lat_max - lat_min + lon_max - lon_min)/2+14.12
    zoom = (
        -23 * (lat_max - lat_min + lon_max - lon_min) / 2
        + 17
        - (lat_max - lat_min) / (lon_max - lon_min)
    )
    print(zoom)

    route_coordinates = get_osrm_route([(m[0], m[1]) for m in markers])

    # Tworzenie mapy z trasą
    file_path = create_map(
        lat, lon, zoom_start=zoom, markers=markers, route=route_coordinates
    )

    # file_path = create_map(lat, lon, zoom_start=zoom, markers=markers)

    # Wczytywanie wygenerowanego pliku HTML
    with open(file_path, "r") as file:
        content = file.read()

    return HTMLResponse(content=content)
