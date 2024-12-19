from neomodel import (
    StructuredNode,
    StringProperty,
    RelationshipTo,
    RelationshipFrom,
    IntegerProperty,
    UniqueIdProperty
)
from neomodel.contrib.spatial_properties import NeomodelPoint

class Courier(StructuredNode):
    courierID = UniqueIdProperty()
    name = StringProperty()

    is_at = RelationshipTo('Location', 'IS_AT')
    delivers_to = RelationshipTo('Location', 'DELIVERS_TO')

class Location(StructuredNode):
    locationID = UniqueIdProperty()
    address = StringProperty()
    coordinates = NeomodelPoint(x=0.0, y=0.0)

    is_visited_by = RelationshipFrom('Courier', 'IS_AT')
    delivered_by = RelationshipFrom('Courier', 'DELIVERS_TO')
    next_location = RelationshipTo('Location', 'NEXT')
