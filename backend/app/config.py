from neontology import Database
import os

# Load Neo4j configurations from environment variables
NEO4J_URL = os.getenv("NEO4J_URL", "bolt://localhost:7687")  # Default Neo4j URI
NEO4J_AUTH = os.getenv("NEO4J_AUTH", "neo4j/password")  # Format: username/password

# Extract the username and password from the NEO4J_AUTH string
NEO4J_USER, NEO4J_PASSWORD = NEO4J_AUTH.split("/")

# Initialize the database connection
database = Database(NEO4J_URL, NEO4J_USER, NEO4J_PASSWORD)
