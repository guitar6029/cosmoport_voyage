from datetime import datetime, timezone

from jose import jwt, ExpiredSignatureError, JWTError
from server.core.settings import settings
from server.schemas.token_payload import TokenPayload


def verify_jwt_token(token_to_validate) -> TokenPayload:
    try:
        decoded_payload = jwt.decode(
            token_to_validate,
            settings.JWT_SECRET,
            algorithms=["HS256"],
        )
        exp_datetime = datetime.fromtimestamp(decoded_payload["exp"], tz=timezone.utc)

        return TokenPayload(
            sub=decoded_payload["sub"],
            exp=exp_datetime,
        )

    except ExpiredSignatureError:
        raise

    except JWTError:
        raise
