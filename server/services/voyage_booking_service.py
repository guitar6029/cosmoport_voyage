from fastapi import HTTPException

from server.models.models import Voyage
from server.models.voyageBooking import VoyageBooking, VoyageBookingCreate


async def _get_voyage_or_404(voyage_id: int) -> Voyage:
    voyage = await Voyage.find_one(Voyage.voyage_id == voyage_id)
    if voyage is None:
        raise HTTPException(status_code=404, detail="Voyage does not exist")
    return voyage


async def list_bookings_for_voyage(voyage_id: int, limit: int, skip: int):
    await _get_voyage_or_404(voyage_id)

    bookings = (
        await VoyageBooking.find(VoyageBooking.voyage_id == voyage_id)
        .skip(skip)
        .limit(limit)
        .to_list()
    )

    return {"voyage_id": voyage_id, "limit": limit, "skip": skip, "bookings": bookings}


async def create_booking_for_voyage(
    voyage_id: int, voyage_booking: VoyageBookingCreate
):
    await _get_voyage_or_404(voyage_id)

    booking = VoyageBooking(
        voyage_id=voyage_id,
        **voyage_booking.model_dump(),
    )

    await booking.insert()

    return {"booking": booking}


async def delete_voyage_booking_by_id(voyage_id: int, booking_id: str):
    await _get_voyage_or_404(voyage_id)

    booking = await VoyageBooking.get(booking_id)

    if booking is None:
        raise HTTPException(status_code=404, detail="Booking does not exist")

    if booking.voyage_id != voyage_id:
        raise HTTPException(
            status_code=404, detail="Booking does not exist for this voyage"
        )

    await booking.delete()

    return {"message": "Booking deleted"}
