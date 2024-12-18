from neomodel import StructuredNode, StringProperty, RelationshipTo, RelationshipFrom

class Courier(StructuredNode):
    name = StringProperty()
    phone_number = StringProperty()

    is_at = RelationshipTo('Location', 'IS_AT')
    delivers_to = RelationshipTo('Location', 'DELIVERS_TO')

class Location(StructuredNode):
    name = StringProperty()
    address = StringProperty()

    is_visited_by = RelationshipFrom('Courier', 'IS_AT')
    delivered_by = RelationshipFrom('Courier', 'DELIVERS_TO')
    next_location = RelationshipTo('Location', 'NEXT')
