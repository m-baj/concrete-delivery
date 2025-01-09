from dataclasses import asdict
from typing import Tuple
from sqlmodel import Session

from app.utils.vroom.models import Input, Route, StartEndStep, JobStep, Violation, OptimizationResult, VroomJob
from app.utils.hour import hour_from_str_to_seconds
from app.models import OrderBase
from app.crud import get_address_by_id

def read_from_json(data) -> OptimizationResult:
    summary = data["summary"]
    code = data["code"]
    unassigned = data["unassigned"]
    routes = []
    for route in data["routes"]:
        steps = []
        for step in route["steps"]:
            if step["type"] in ["start", "end"]:
                steps.append(StartEndStep(**step))
            else:
                steps.append(JobStep(**step))
        violations = [Violation(**violation) for violation in route["violations"]]
        route = Route(
            vehicle=route["vehicle"], cost=route["cost"], description=route["description"], 
            service=route["service"], duration=route["duration"], waiting_time=route["waiting_time"], 
            priority=route["priority"], steps=steps, violations=violations
        )
        routes.append(route)
    return OptimizationResult(code=code, summary=summary, unassigned=unassigned, routes=routes)

def base_order_to_pickup_and_deliver_jobs(order: OrderBase, session: Session) -> Tuple[JobStep, JobStep]:
    pickup_address = get_address_by_id(session=session, address_id=order.pickup_address_id)
    delivery_address = get_address_by_id(session=session, address_id=order.delivery_address_id)
    pickup = VroomJob(
        id=0, 
        description="Pickup", 
        location=[pickup_address.X_coordinate, pickup_address.Y_coordinate],
        time_window=[
            hour_from_str_to_seconds(order.pickup_start_time), 
            hour_from_str_to_seconds(order.pickup_end_time)
        ]
    )
    deliver = VroomJob(
        id=1, 
        description="Deliver", 
        location=[delivery_address.X_coordinate, delivery_address.Y_coordinate],
        time_window=[
            hour_from_str_to_seconds(order.delivery_start_time), 
            hour_from_str_to_seconds(order.delivery_end_time)
        ]
    )
    return pickup, deliver