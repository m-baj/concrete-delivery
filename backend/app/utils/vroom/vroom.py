import requests
from dataclasses import dataclass
from typing import List, Optional

from app.core.config import settings
from app.utils.vroom.json_parser import read_from_json, save_to_json
from app.utils.vroom.models import VroomVehicle, VroomJob, Input, OptimizationResult

@dataclass
class Vroom:
    working_couriers: List[VroomVehicle]
    orders: List[VroomJob]
    optimization_result: Optional[OptimizationResult] = None

    def __post_init__(self):
        self.url = settings.VROOM_URL

    def find_route(self, options: dict = None):
        if not options:
            opttions = {}
        input_data = Input(vehicles=self.working_couriers, jobs=self.orders, options=options)
        response = requests.post(self.url, json=save_to_json(input_data))
        response.raise_for_status()
        self.optimization_result = read_from_json(response.json())
    
    def verify_result(self):
        if not self.optimization_result:
            raise ValueError("No optimization result found, run optimize() first")
        # TODO: Check if delay is within acceptable limits
        return True
