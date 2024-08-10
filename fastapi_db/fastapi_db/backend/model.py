from datetime import datetime
from typing import Annotated, Optional
from fastapi import Form
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, SQLModel, Enum


class UserBase(SQLModel):
    created_at: str = Field(index=True, nullable=False,
                            default=datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
                            )


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    email: str = Field(unique=True, nullable=False)
    password: str


class Userlogin(SQLModel):
    email: str
    password: str


class Register_User (BaseModel):
    id: int | None = None
    username: str
    email: str
    password: str


class Token (BaseModel):
    access_token: str
    token_type: str
    # refresh_token: str


class TokenData (BaseModel):
    username: str


class RefreshToken (BaseModel):
    email: str
