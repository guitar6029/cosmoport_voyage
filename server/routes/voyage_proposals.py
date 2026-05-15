from fastapi import APIRouter, Query
from server.schemas.voyage_proposal_payload import VoyageProposalResponse
from server.models.voyages.voyage_proposal import VoyageProposal
from server.services.voyage_proposal_service import get_proposal

router = APIRouter(prefix="/voyage-proposals", tags=["voyage_proposals"])


@router.get("")
async def list_voyage_proposals(
    limit: int = Query(default=10, ge=1, le=100), skip: int = Query(default=0, ge=1)
) -> list[VoyageProposalResponse] | None:
    # return VoyageProposal.find_all().skip(skip).limit(limit).to_list()
    pass


@router.get("/{proposal_id}", response_model=VoyageProposalResponse)
async def get_proposal_by_id(proposal_id: str) -> VoyageProposalResponse:

    proposal = await get_proposal(proposal_id)

    return VoyageProposalResponse(
        **proposal.model_dump(),
    )
