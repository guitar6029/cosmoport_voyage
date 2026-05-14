from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


def clean_name(value: str, field_name: str) -> str:
    value = value.strip()
    if not value:
        raise ValueError(f"{field_name} is required")
    return value


class UserLogin(BaseModel):
    email: EmailStr
    password: Annotated[str, Field(min_length=1, max_length=128)]

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: str):
        if isinstance(value, str):
            return value.strip().lower()
        return value


class UserRegister(BaseModel):
    first_name: Annotated[str, Field(min_length=1, max_length=50)]
    last_name: Annotated[str, Field(min_length=1, max_length=50)]
    username: Annotated[str, Field(min_length=2)]
    email: EmailStr
    password: Annotated[str, Field(min_length=8, max_length=128)]

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str):
        value = value.strip().lower()
        if " " in value:
            raise ValueError("username cannot contain spaces")
        return value

    @field_validator("first_name", "last_name", "username")
    @classmethod
    def validate_names(cls, value: str, info):
        return clean_name(value, info.field_name)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: str):
        if isinstance(value, str):
            return value.strip().lower()
        return value


class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    username: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)


class UserProfile(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)
