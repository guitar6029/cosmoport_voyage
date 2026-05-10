from fastapi import APIRouter, HTTPException, Query
from server.models.models import Voyage
from server.models.voyageBooking import VoyageBookingCreate, VoyageBooking

router = APIRouter(prefix="/voyages", tags=["voyages"])


@router.get("")
async def list_voyages(
    limit: int = Query(default=10, ge=1, le=100), skip: int = Query(default=0, ge=0)
):
    return await Voyage.find_all().skip(skip).limit(limit).to_list()


# list voyage booking
@router.get("/{voyage_id}/interest")
async def list_voyage_booking_list_by_id(
    voyage_id: int,
    limit: int = Query(default=10, ge=1, le=100),
    skip: int = Query(default=0, ge=0),
):
    voyage = await Voyage.find_one(Voyage.voyage_id == voyage_id)
    if voyage is None:
        raise HTTPException(status_code=404, detail="Voyage does not exist")

    bookings = (
        await VoyageBooking.find(VoyageBooking.voyage_id == voyage_id)
        .skip(skip)
        .limit(limit)
        .to_list()
    )

    return {"voyage_id": voyage_id, "limit": limit, "skip": skip, "bookings": bookings}


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
