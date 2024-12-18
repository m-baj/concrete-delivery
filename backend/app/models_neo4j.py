from neontology import BaseNode, BaseRelationship
from typing import ClassVar, List

class Location(BaseNode):
    __primarylabel__: ClassVar[str] = "Location"
    __primaryproperty__: ClassVar[int] = "locationID"

    locationID: int
    address: str
    coordinates: List[float]
    orderID: int

class Courier(BaseNode):
    __primarylabel__: ClassVar[str] = "Courier"
    __primaryproperty__: ClassVar[int] = "courierID"

    courierID: int
    name: str
    locationID: int

class IsAt(BaseRelationship):
    __relationshiptype__: ClassVar[str] = "IS_AT"
    source: Courier
    target: Location

class DeliversTo(BaseRelationship):
    __relationshiptype__: ClassVar[str] = "DELIVERS_TO"
    source: Courier
    target: Location

class Then(BaseRelationship):
    __relationshiptype__: ClassVar[str] = "THEN"
    source: Location
    target: Location
