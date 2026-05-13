from fastapi import APIRouter
from server.schemas.auth import AuthResponse
from server.schemas.user import UserLogin, UserRegister, UserResponse
from server.services.auth_service import (
    register_user as register_user_svc,
    login_user as login_user_svc,
)
from server.utils.token import create_access_token

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
