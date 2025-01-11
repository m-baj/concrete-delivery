import pytest
import app.crud_neo4j as crud
from neomodel import db, clear_neo4j_database
from app.models_neo4j import Courier, Location
from app.api_models_neo4j import (
    LocationAPI,
    LocationsAPI,
    CourierAPI,
    AddLocationsRequest,
)


@pytest.fixture(autouse=True)
def clear_db():
    clear_neo4j_database(db)


def test_create_courier():
    courier_id = "1"
    name = "Test"
    courier = crud.create_courier(courier_id=courier_id, name=name)
    assert courier.courierID == courier_id
    assert courier.name == name


def test_get_courier_by_id():
    courier_id = "1"
    test_courier = crud.create_courier(courier_id=courier_id, name="Test")
    courier = crud.get_courier_by_id(courier_id=courier_id)
    assert courier.courierID == courier_id
    assert courier.name == "Test"


def test_create_location():
    location_id = "1"
    address = "Test Address"
    coordinates = [1.0, 1.0]
    location = crud.create_location(
        location_id=location_id, address=address, coordinates=coordinates
    )
    assert location.locationID == location_id
    assert location.address == address
    assert location.coordinates == coordinates


def test_get_location_by_id():
    location_id = "1"
    test_location = crud.create_location(
        location_id=location_id, address="Test Address", coordinates=[1.0, 1.0]
    )
    location = crud.get_location_by_id(location_id=location_id)
    assert location.locationID == location_id
    assert location.address == "Test Address"


def test_connect_delivers_to():
    courier = crud.create_courier("1", "Courier 1")
    location = crud.create_location("1", "Address 1", [0.0, 0.0])
    crud.connect_delivers_to(courier, location)
    assert len(courier.delivers_to.all()) == 1
    assert courier.delivers_to.all()[0].locationID == location.locationID


def test_disconnect_all_delivers_to():
    courier = crud.create_courier("1", "Courier 1")
    location1 = crud.create_location("1", "Address 1", [0.0, 0.0])
    location2 = crud.create_location("2", "Address 2", [1.0, 1.0])
    courier.delivers_to.connect(location1)
    courier.delivers_to.connect(location2)
    assert len(courier.delivers_to.all()) == 2

    crud.disconnect_all_delivers_to(courier)
    assert len(courier.delivers_to.all()) == 0


def test_connect_next_location():
    location1 = crud.create_location("1", "Address 1", [0.0, 0.0])
    location2 = crud.create_location("2", "Address 2", [1.0, 1.0])
    crud.connect_next_location(location1, location2)
    assert location1.next_location.single().locationID == location2.locationID


def test_get_current_location():
    courier = crud.create_courier("1", "Courier 1")
    location = crud.create_location("1", "Address 1", [0.0, 0.0])
    crud.connect_current_location(courier, location)
    current_location = crud.get_current_location(courier)
    assert current_location.locationID == location.locationID


def test_disconnect_current_location():
    courier = crud.create_courier("1", "Courier 1")
    location = crud.create_location("1", "Address 1", [0.0, 0.0])
    crud.connect_current_location(courier, location)
    crud.disconnect_current_location(courier, location)
    assert courier.is_at.all() == []


def test_connect_current_location():
    courier = crud.create_courier("1", "Courier 1")
    location = crud.create_location("1", "Address 1", [0.0, 0.0])
    crud.connect_current_location(courier, location)
    assert courier.is_at.single().locationID == location.locationID
