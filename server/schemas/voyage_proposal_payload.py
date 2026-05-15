from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime
from server.types.difficulty import Difficulty
from server.types.status_proposal import StatusProposal


class VoyageProposalResponse(BaseModel):
    name: str
    description: str
    origin: str | None
    destination: str | None
    difficulty: Optional[Difficulty] | None
    recommendedShip: str | None
    reward: int | None
    imageUrlKey: str | None
    status: StatusProposal
    created_at: datetime
    closes_at: datetime

    model_config = ConfigDict(from_attributes=True)
