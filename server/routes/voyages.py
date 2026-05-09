from fastapi import APIRouter, HTTPException
from server.models.models import Voyage
from server.models.voyageBooking import VoyageBookingCreate, VoyageBooking

router = APIRouter(prefix="/voyages", tags=["voyages"])


@router.get("")
async def list_voyages():
    return await Voyage.find_all().to_list()


# voyage booking
# name, email, and optional message
@router.post("/{voyage_id}/interest")
async def create_voyage_booking(voyage_id: int, voyage_booking: VoyageBookingCreate):

    voyage = await Voyage.find_one(Voyage.voyage_id == voyage_id)
    if voyage is None:
        raise HTTPException(
            status_code=404,
            detail="Voyage does not exist",
        )

    booking = VoyageBooking(
        voyage_id=voyage_id,
        **voyage_booking.model_dump(),
    )

    await booking.insert()

    return {"booking": booking}
