from neontology import Node, Property, Relationship
from neontology import Point

class Location(Node):
    locationID = Property(int, unique=True)
    address = Property(str, required=False)
    coordinates = Property(Point)
    orderID = Property(int, required=False)

class Courier(Node):
    courierID = Property(int, unique=True)
    name = Property(str)
    locationID = Property(int)

class IsAt(Relationship):
    start_node = Courier
    end_node = Location

class DeliversTo(Relationship):
    start_node = Courier
    end_node = Location
    pass

class Then(Relationship):
    start_node = Location
    end_node = Location
