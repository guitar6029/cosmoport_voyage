from pydantic import Field
from beanie import Document
from typing import Annotated, Optional
from datetime import datetime, timezone
from server.types.difficulty import Difficulty
from server.types.status_proposal import StatusProposal


class VoyageProposal(Document):
    name: str
    description: Annotated[str, Field(min_length=5, max_length=250)]
    origin: Optional[str] = None
    destination: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    recommendedShip: Optional[str] = None
    reward: Optional[int] = None
    imageUrlKey: Optional[str] = None
    status: StatusProposal = "open"
    created_at: Annotated[
        datetime, Field(default_factory=lambda: datetime.now(timezone.utc))
    ]
    closes_at: datetime

    class Settings:
        name = "voyage_proposals"
