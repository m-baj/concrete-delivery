from dataclasses import dataclass
from typing import Dict

from app.utils.vroom.models import OptimizationResult
import app.crud_neo4j as crud_neo4j


@dataclass
class Neo4jUpdater:
    optimization_result: OptimizationResult
    vehicle_id_to_courier_id: Dict[int, str]

    def update_routes(self):
        for route in self.optimization_result.routes:
            courier_id = self.vehicle_id_to_courier_id[route.vehicle]
            locations = [step.location for step in route.steps]
            crud_neo4j.write_locations_to_courier(courier_id, locations)