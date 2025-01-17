from neomodel import (
    StructuredNode,
    StringProperty,
    RelationshipTo,
    RelationshipFrom,
    IntegerProperty,
    ArrayProperty
)

class Courier(StructuredNode):
    courierID = StringProperty()
    name = StringProperty()

    is_at = RelationshipTo('Location', 'IS_AT')
    delivers_to = RelationshipTo('Location', 'DELIVERS_TO')

class Location(StructuredNode):
    locationID = StringProperty()
    address = StringProperty()
    coordinates = ArrayProperty()
    order_type = StringProperty(default=None, required=False)
    orderID = StringProperty(default=None, required=False)

    is_visited_by = RelationshipFrom('Courier', 'IS_AT')
    delivered_by = RelationshipFrom('Courier', 'DELIVERS_TO')
    next_location = RelationshipTo('Location', 'NEXT')
