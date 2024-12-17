from neontology import Node, Property, Relationship
from neontology import Point

class Location(Node):
    locationID = Property(int, unique=True)  # Unique identifier for each location
    address = Property(str, required=False)  # Optional address property
    coordinates = Property(Point)  # Geospatial coordinates (Neo4j Point data type)
    orderID = Property(int, required=False)  # Optional order ID

class Courier(Node):
    courierID = Property(int, unique=True)  # Unique identifier for the courier
    name = Property(str)  # Courier's name
    locationID = Property(int)  # Foreign key to Location (the current location of the courier)

# Define the IS_AT relationship between Courier and Location
class IsAt(Relationship):
    start_node = Courier
    end_node = Location

# Define the DELIVERS_TO relationship between Courier and Location
class DeliversTo(Relationship):
    start_node = Courier
    end_node = Location
    pass

# Define the THEN relationship between Location nodes
class Then(Relationship):
    start_node = Location
    end_node = Location
