from beanie import Document
from typing import Optional, Literal
from pydantic import Field

Difficulty =  Literal["Easy", "Moderate", "Hard"]

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
		name = "voyages" #collection name
	class Config:
		#allow using field names or aliases both ways
		populate_by_name = True

