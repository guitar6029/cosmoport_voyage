from fastapi import APIRouter, Query
from server.models.voyages.voyage import Voyage
from server.schemas.voyage_booking import VoyageBookingCreate, VoyageBookingUpdate
from server.services.voyage_booking_service import (
    create_booking_for_voyage,
    delete_voyage_booking_by_id,
    list_bookings_for_voyage,
    update_voyage_booking_by_id,
)

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

    return await list_bookings_for_voyage(voyage_id, limit, skip)


# voyage booking
# name, email, and optional message
@router.post("/{voyage_id}/interest")
async def create_voyage_booking(voyage_id: int, voyage_booking: VoyageBookingCreate):

    return await create_booking_for_voyage(voyage_id, voyage_booking)


# update booking message
@router.patch("/{voyage_id}/interest/{booking_id}")
async def update_voyage_booking(
    voyage_id: int, booking_id: str, message: VoyageBookingUpdate
):
    return await update_voyage_booking_by_id(voyage_id, booking_id, message)


# delete booking by voyage id
@router.delete("/{voyage_id}/interest/{booking_id}")
async def delete_voyage_booking(voyage_id: int, booking_id: str):
    return await delete_voyage_booking_by_id(voyage_id, booking_id)
