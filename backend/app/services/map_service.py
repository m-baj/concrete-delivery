import folium
import os

import requests


def get_osrm_route(markers: list) -> list:
    """
    Pobiera trasę między punktami z OSRM Backend.

    :param markers: Lista punktów [(lat, lon), ...].
    :return: Lista współrzędnych trasy.
    """
    osrm_url = "http://osrm-backend:5000/route/v1/driving/"
    waypoints = ";".join([f"{lon},{lat}" for lat, lon in markers])
    print(waypoints)

    # Ustawienia zapytania bez alternatyw, aby unikać pętli
    query = f"{osrm_url}{waypoints}?overview=full&geometries=geojson&alternatives=false"

    response = requests.get(query)
    if response.status_code == 200:
        route = response.json()
        # Pobierz geometrię trasy (lista współrzędnych)
        coordinates = route["routes"][0]["geometry"]["coordinates"]
        return coordinates
    else:
        raise Exception("Nie udało się pobrać trasy z OSRM.")


def create_map(latitude: float, longitude: float, zoom_start: int = 13, markers: list = None, route: list = None) -> str:
    """
    Tworzy mapę w oparciu o współrzędne i zapisuje ją do pliku HTML.

    :param route:
    :param latitude: Szerokość geograficzna środka mapy.
    :param longitude: Długość geograficzna środka mapy.
    :param zoom_start: Poziom zbliżenia mapy (domyślnie 13).
    :param markers: Lista markerów w formacie [(lat, lon, popup), ...].
    :return: Ścieżka do wygenerowanego pliku HTML.
    """
    # Tworzenie mapy
    m = folium.Map(location=[latitude, longitude], zoom_start=zoom_start)

    # Dodawanie markerów, jeśli są podane
    if markers:
        lat, lon, popup = markers[0]
        folium.Marker(
            location=[lat, lon],
            popup=popup,
            icon=folium.Icon(color="red", icon="location-dot", prefix='fa')).add_to(m)
        for marker in markers[1:]:
            lat, lon, popup = marker
            folium.Marker(
                location=[lat, lon],
                popup=popup,
                icon=folium.Icon(color="blue", icon="location-dot", prefix='fa')).add_to(m)

    if route:
        route_latlon = [(lat, lon) for lon, lat in route]  # Zamiana kolejności
        print(route_latlon)
        folium.PolyLine(route_latlon, color="red", weight=4, opacity=0.7).add_to(m)

    # Zapis mapy do pliku HTML
    file_path = os.path.join(os.getcwd(), "map.html")
    m.save(file_path)
    return file_path
