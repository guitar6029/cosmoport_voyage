import bcrypt


def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password=password_bytes, salt=salt)
    hashed_str = hashed_bytes.decode("utf-8")
    return hashed_str


def verify_password(password: str, hashed_password: str) -> bool:
    password_bytes = password.encode("utf-8")
    hashed_password_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(
        password=password_bytes, hashed_password=hashed_password_bytes
    )
