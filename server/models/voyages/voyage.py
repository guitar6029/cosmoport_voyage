from typing import Literal, Optional

from beanie import Document
from pydantic import Field
from server.types.difficulty import Difficulty


class Voyage(Document):
    voyage_id: int = Field(alias="id", serialization_alias="id")

    name: str
    description: str
    origin: Optional[str] = None
    destination: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    recommendedShip: Optional[str] = None
    reward: Optional[int] = None
    imageUrlKey: Optional[str] = None

    class Settings:
        name = "voyages"

    class Config:
        populate_by_name = True
