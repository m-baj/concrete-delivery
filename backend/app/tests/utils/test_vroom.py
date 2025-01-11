from app.utils.vroom.vroom import Vroom
from app.core.config import settings
from app.utils.vroom.models import VroomVehicle, VroomJob

def test_vroom_init():
    vroom = Vroom(working_couriers=[], orders=[])
    assert vroom.url == settings.VROOM_URL

def test_vroom_find_route():
    V = VroomVehicle(id=1, description="V", start=[2.3526,48.8604], end=[2.3526,48.8604], time_window=[0, 86400])
    J = VroomJob(id=1, description="J", location=[2.3691,48.8532], time_window=[0, 86400])
    vroom = Vroom(working_couriers=[V], orders=[J])
    vroom.find_route()
    assert vroom.optimization_result is not None