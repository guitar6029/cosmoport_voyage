from datetime import datetime, timezone
from beanie import Document
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from server.types.vote import Vote


class VoyageProposalVote(Document):
    proposal_id: int
    user_id: str
    vote: Vote
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "voyage_proposal_votes"
        indexes = [
            IndexModel(
                keys=[("proposal_id", ASCENDING), ("user_id", ASCENDING)],
                name="unique_vote_per_user_per_proposal",
                unique=True,
            )
        ]
