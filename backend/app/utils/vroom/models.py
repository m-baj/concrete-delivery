from dataclasses import dataclass, field
from typing import List


@dataclass
class VroomVehicle:
    id: int
    description: str
    start: List[float]
    end: List[float]
    time_window: List[int]  # working hours

@dataclass
class Pickup:
    id: int
    description: str
    location: List[float]
    time_window: List[int]

@dataclass
class Delivery:
    id: int
    description: str
    location: List[float]
    time_window: List[int]

@dataclass
class Shipment:
    pickup: Pickup
    delivery: Delivery

@dataclass
class VroomJob:
    id: int
    description: str
    location: List[float]
    time_window: List[int]

@dataclass
class PickUpJob(VroomJob):
     pickup: List[int] = field(default_factory=lambda: [1])

@dataclass
class DeliveryJob(VroomJob):
     pickup: List[int] = field(default_factory=lambda: [1])


@dataclass
class Violation:
    cause: str


@dataclass
class Input:
    vehicles: List[VroomVehicle]
    jobs: List[VroomJob]
    shipments: List[Shipment]
    options: dict


@dataclass
class Step:
    type: str
    location: List[float]
    service: int
    waiting_time: int
    arrival: int
    duration: int
    violations: List[Violation]


@dataclass
class StartEndStep(Step):
    pass


@dataclass
class JobStep(Step):
    description: str
    id: int
    job: int

@dataclass
class Route:
    vehicle: int
    cost: int
    description: str
    service: int
    duration: int
    waiting_time: int
    priority: int
    steps: List[Step]
    violations: List[Violation]


@dataclass
class OptimizationResult:
    code: int
    summary: dict
    unassigned: List[int]
    routes: List[Route]


PICKUP_VROOMJOB_OFFSET = 1
DELIVERY_VROOMJOB_OFFSET = 2

@dataclass
class Location:
    location: List[List[float]]
    order_id: str