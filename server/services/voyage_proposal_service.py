from fastapi import HTTPException, status
from server.models.voyages.voyage_proposal import VoyageProposal
from server.schemas.voyage_proposal_payload import VoyageProposalResponse
from server.utils.convert_to_mongo_object_id import convert_to_mongo_objectid


async def _get_proposal_or_404(proposal_id: str):
    # convert proposal_id to ObjectId
    mongo_object_id = convert_to_mongo_objectid(proposal_id)

    # check if proposal exists
    proposal = await VoyageProposal.find_one(VoyageProposal.id == mongo_object_id)
    if proposal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found"
        )
    return proposal


async def get_proposal(proposal_id: str) -> VoyageProposalResponse:
    # verify id is not empty
    if not proposal_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid proposal id"
        )

    proposal = await _get_proposal_or_404(proposal_id)

    proposal_response = VoyageProposalResponse.model_validate(proposal)

    return proposal_response
