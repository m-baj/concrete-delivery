from dataclasses import dataclass
from typing import Dict
from sqlmodel import Session

from app.utils.vroom.models import OptimizationResult
import app.crud_neo4j as crud_neo4j

def update_routes(
    optimization_result: OptimizationResult, vehicle_id_to_courier_id: Dict[str, str], session: Session
) -> None:
    for route in optimization_result.routes:
        courier_id = vehicle_id_to_courier_id[route.vehicle]
        locations = [step.location for step in route.steps]
        crud_neo4j.write_locations_to_courier(courier_id, locations)