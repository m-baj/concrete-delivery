from dataclasses import dataclass
from typing import Dict
from sqlmodel import Session

from app.utils.vroom.models import OptimizationResult, LocationVroom, JobStep
import app.crud_neo4j as crud_neo4j

def update_routes(
    optimization_result: OptimizationResult, vehicle_id_to_courier_id: Dict[str, str], session: Session
) -> None:
    for route in optimization_result.routes:
        courier_id = vehicle_id_to_courier_id[route.vehicle]
        locations = []
        for step in route.steps:
            if isinstance(step, JobStep):
                locations.append(LocationVroom(location=step.location, order_id=step.description, type=step.type))
            else:
                locations.append(LocationVroom(location=step.location, type=step.type))
        crud_neo4j.write_locations_to_courier(session, courier_id, locations)

def update_order_id(optimization_result, order_id) -> OptimizationResult:
    for route in optimization_result.routes:
        for step in route.steps:
            if isinstance(step, JobStep):
                if step.description == "Pickup" or step.description == "Deliver":
                    step.description = order_id
    return optimization_result