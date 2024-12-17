import folium
import os

def create_map(latitude: float, longitude: float, zoom_start: int = 13, markers: list = None) -> str:
    """
    Tworzy mapę w oparciu o współrzędne i zapisuje ją do pliku HTML.

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

    # Zapis mapy do pliku HTML
    file_path = os.path.join(os.getcwd(), "map.html")
    m.save(file_path)
    return file_path
