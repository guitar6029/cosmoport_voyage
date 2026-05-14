from typing import Optional

from beanie import Document
from pydantic import EmailStr


class VoyageBooking(Document):
    voyage_id: int
    name: str
    email: EmailStr
    message: Optional[str] = None

    class Settings:
        name = "voyage_booking"
