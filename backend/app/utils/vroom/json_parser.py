from dataclasses import asdict
import json
import os
from app.utils.vroom.models import Input, Route, StartEndStep, JobStep, Violation, OptimizationResult

def save_to_json(input: Input, file_name: str = "input.json"):
    with open(file_name, "w") as f:
        json.dump(asdict(input), f, indent=4)


def read_from_json(file_name: str = "../vroom/output.json") -> OptimizationResult:
    with open(file_name, "r") as f:
        data = json.load(f)
   
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
