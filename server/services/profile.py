from fastapi import HTTPException, status
from server.models.users.user import User
from server.schemas.user import UserProfile

from server.utils.convert_to_mongo_object_id import convert_to_mongo_objectid


async def _get_user_or_404(user_id: str) -> User:
    mongo_object_id = convert_to_mongo_objectid(user_id)
    user = await User.find_one(User.id == mongo_object_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


async def get_profile_details(id: str) -> UserProfile:
    # check if exists
    user = await _get_user_or_404(id)

    user_response = UserProfile.model_validate(user)

    return user_response
