from fastapi import APIRouter, Request
from server.schemas.auth import AuthResponse
from server.schemas.user import UserLogin, UserProfile, UserRegister, UserResponse
from server.services.auth_service import (
    register_user as register_user_svc,
    login_user as login_user_svc,
)
from server.utils.token import create_access_token
from server.services.auth_service import profile_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
async def register_user(user: UserRegister) -> AuthResponse:

    registered_user = await register_user_svc(user)

    access_token = create_access_token(subject=str(registered_user.id))

    user_response = UserResponse.model_validate(
        {**registered_user.model_dump(), "id": str(registered_user.id)}
    )

    return AuthResponse(
        user=user_response,
        access_token=access_token,
        token_type="bearer",
    )


@router.post("/login", response_model=AuthResponse)
async def login(user: UserLogin) -> AuthResponse:
    existing_user = await login_user_svc(user)

    access_token = create_access_token(subject=str(existing_user.id))

    user_response = UserResponse.model_validate(
        {**existing_user.model_dump(), "id": str(existing_user.id)}
    )

    return AuthResponse(
        user=user_response, access_token=access_token, token_type="bearer"
    )


@router.get("/me", response_model=UserProfile)
async def get_profile(request: Request):
    # get the Authorization header
    auth_header = request.headers.get("authorization")
    profile = await profile_user(auth_header=auth_header)

    return profile
