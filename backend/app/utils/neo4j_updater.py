from dataclasses import dataclass
from typing import Dict

from app.utils.vroom.models import OptimizationResult

@dataclass
class Neo4jUpdater:
    optimization_result: OptimizationResult
    vehicle_id_to_courier_id: Dict[int, str]

    def update_routes(self):
        pass