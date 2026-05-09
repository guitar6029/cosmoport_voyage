from fastapi import APIRouter
from server.models.models import Voyage

router = APIRouter(prefix="/voyages", tags=["voyages"])


@router.get("")
async def list_voyages():
    return await Voyage.find_all().to_list()
