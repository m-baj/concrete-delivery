import pytest

from app.utils.hour import hour_from_str_to_seconds
from app.utils.geocoding import get_coordinates, get_address


def test_hour_from_str_to_seconds_valid():
    assert hour_from_str_to_seconds("4:20") == 4 * 3600 + 20 * 60
    assert hour_from_str_to_seconds("04:20") == 4 * 3600 + 20 * 60

def test_hour_from_str_to_seconds_invalid():
    with pytest.raises(ValueError):
        hour_from_str_to_seconds("4.20")
    with pytest.raises(ValueError):
        hour_from_str_to_seconds("4:20:30")
    with pytest.raises(ValueError):
        hour_from_str_to_seconds("4-20")
    with pytest.raises(ValueError):
        hour_from_str_to_seconds("4.20.30")

def test_get_coordinates():
    assert get_coordinates("Calle de la Princesa, 1, Madrid") is not None

def test_get_coordinates_invalid_address():
    with pytest.raises(ValueError):
        get_coordinates("invalid address")

def test_get_address():
    assert get_address((40.4246118, -3.7121376)) == "BBVA, 1, Calle de la Princesa, Argüelles, Moncloa-Aravaca, Madrid, Comunidad de Madrid, 28008, España"