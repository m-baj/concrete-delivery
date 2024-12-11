from neontology import BaseNode, BaseRelationship
from typing import ClassVar


class Courier(BaseNode):
    __primarylabel__: ClassVar[str] = "Courier"
    __primaryproperty__: ClassVar[str] = "courierID"

    courierID: int
    name: str


class Location(BaseNode):
    __primarylabel__: ClassVar[str] = "Location"
    __primaryproperty__: ClassVar[str] = "locationID"

    locationID: int
    address: str
    coordinates: str
    orderID: int


class BelongsTo(BaseRelationship):
    __relationshiptype__: ClassVar[str] = "IS_AT"

    source: Location
    target: Courier


# # Iterowanie po kurierach i wyświetlanie ich lokalizacji
# for courier in couriers:
#     print(f"Kurier: {courier.name}")
#     for location in courier.locations:
#         print(f"   Lokalizacja: {location.address}")
