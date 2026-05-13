from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError


from server.models.user import User
from server.schemas.user import UserLogin, UserRegister
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
