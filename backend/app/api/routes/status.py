from fastapi import APIRouter
from app.models import Status, StatusCreate, StatusPublic
from app import crud
from app.api.dependecies import SessionDep


router = APIRouter(prefix="/status", tags=["status"])


@router.post("/", response_model=StatusPublic)
def add_status(status: StatusCreate, session: SessionDep) -> StatusPublic:
    return crud.add_status(session=session, status=status)


@router.get("/name", response_model=StatusPublic)
def get_status_by_name(status_name: str, session: SessionDep) -> StatusPublic:
    return crud.get_status_by_name(session=session, status_name=status_name)


@router.get("/{status_id}", response_model=StatusPublic)
def get_status(status_id: str, session: SessionDep) -> StatusPublic:
    return crud.get_status(session=session, status_id=status_id)
