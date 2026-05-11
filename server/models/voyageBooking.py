from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from beanie import Document


class VoyageBookingUpdate(BaseModel):
    message: Optional[str] = None

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, value: Optional[str]):
        if value is None:
            return None
        value = value.strip()
        return value or None


class VoyageBookingCreate(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    message: Optional[str] = None

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError("name is required")
        return value

    @field_validator("email", mode="before")
    @classmethod
    def clean_email(cls, value: str):
        if isinstance(value, str):
            return value.strip().lower()
        return value

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, value: Optional[str]):
        if value is None:
            return value
        value = value.strip()
        if value == "":
            return None
        return value


class VoyageBooking(Document):
    voyage_id: int
    name: str
    email: EmailStr
    message: Optional[str] = None

    class Settings:
        name = "voyage_booking"
