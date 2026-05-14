from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError
from server.utils.jwt import verify_jwt_token
from server.services.profile import get_profile_details

from server.models.users.user import User
from server.schemas.user import UserLogin, UserProfile, UserRegister
from server.utils.password import hash_password, verify_password


async def register_user(user: UserRegister) -> User:
    existing_email = await User.find_one(User.email == user.email)
    if existing_email is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    existing_username = await User.find_one(User.username == user.username)
    if existing_username is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username is already taken",
        )

    new_register_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        username=user.username,
        hashed_password=hash_password(user.password),
    )

    try:
        await new_register_user.insert()

    except DuplicateKeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email or username is already taken",
        ) from exc

    return new_register_user


async def login_user(user: UserLogin) -> User:
    existing_user = await User.find_one(User.email == user.email)
    if existing_user is None or not verify_password(
        user.password, existing_user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    return existing_user


async def profile_user(auth_header: str | None) -> UserProfile:
    # http header validation
    # check the authorization header
    # is it authorization header ie contains authoization
    # if not return error 401
    if auth_header is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization headers",
        )

    # if authorzation header then check if the value has Bearer str
    # if does not have Bearer then raise 401

    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required"
        )

    # if has Bearer, then split the str, get the last str section - the jwt string only
    # does it exist if not then raise error 401
    token = auth_header.split("Bearer ")[-1]
    if not token.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required"
        )

    # validate the jwt
    # decode the token
    decoded_token = verify_jwt_token(token)

    # get the sub unique identifier
    sub_value = decoded_token.sub

    # get the user
    user = await get_profile_details(sub_value)

    return user
