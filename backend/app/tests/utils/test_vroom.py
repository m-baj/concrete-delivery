from app.utils.vroom.vroom import Vroom
from app.core.config import settings

def test_vroom_init():
    vroom = Vroom(working_couriers=[], orders=[])
    assert vroom.url == settings.VROOM_URL

def test_vroom_find_route():
    vroom = Vroom(working_couriers=[], orders=[])
    vroom.find_route()
    assert vroom.optimization_result is not None