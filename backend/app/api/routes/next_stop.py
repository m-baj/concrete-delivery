from fastapi import APIRouter

router = APIRouter(tags=["next_stop"])

@router.get("/next_stop", response_model=str)
def get_next_stop():
    markers = [
        (52.2297, 21.0122, "ul. Marszałkowska 10"),
        (52.2385, 21.0144, "ul. Tadeusza Czackiego 21"),
        (52.2333, 21.0102, "ul. Marszałkowska 104")
    ]
    next_stop = markers[0][2]
    return next_stop