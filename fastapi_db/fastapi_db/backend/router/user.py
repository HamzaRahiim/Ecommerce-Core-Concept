from datetime import timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError  # Import the exception
from passlib.context import CryptContext
from typing import Annotated

from backend.auth import authenticate_user, create_refresh_token, current_user, get_user_from_db, hash_password, validate_refresh_token
from ..model import User, Register_User, Token, Userlogin
from ..depend import get_session
from sqlmodel import Session
from backend.auth import create_access_token

from backend.auth import EXPIRY_TIME, oauth_scheme
user_router = APIRouter(
    prefix="/user",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@user_router.get("/")
def user():
    return {"message": "Hello User"}


@user_router.post("/register_user")
async def create_user(new_user: Register_User, session: Annotated[Session, Depends(get_session)]):
    try:
        print(new_user)
        db_user = get_user_from_db(session, new_user.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists."
            )
        user = User(username=new_user.username, email=new_user.email,
                    password=hash_password(new_user.password))
        session.add(user)
        session.commit()
        session.refresh(user)
        return {
            "message": "User registered successfully"
        }
    except IntegrityError as e:
        if "user_email_key" in str(e):  # Check for unique constraint violation
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred")


@user_router.get("/me")
async def user_me(current_user: Annotated[User, Depends(current_user)]):

    return current_user


@user_router.post("/login")
async def login(form_data: Userlogin,
                session: Annotated[Session, Depends(get_session)]):
    user = authenticate_user(form_data.email, form_data.password, session)
    print(user)
    if not user:
        raise HTTPException(
            status_code=401, detail="Invalid username or password")

    expire_time = timedelta(minutes=EXPIRY_TIME)
    access_token = create_access_token(
        {"sub": form_data.email}, expire_time)

    refresh_expire_time = timedelta(days=7)
    refresh_token = create_refresh_token(
        {"sub": user.username}, refresh_expire_time)

    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}


@user_router.post("/login/refresh")
def refresh_token(old_refresh_token: str,
                  session: Annotated[Session, Depends(get_session)]):

    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token, Please login again",
        headers={"www-Authenticate": "Bearer"}
    )

    user = validate_refresh_token(old_refresh_token,
                                  session)
    if not user:
        raise credential_exception

    expire_time = timedelta(minutes=EXPIRY_TIME)
    access_token = create_access_token({"sub": user[0].username}, expire_time)

    refresh_expire_time = timedelta(days=7)
    refresh_token = create_refresh_token(
        {"sub": user[0].email}, refresh_expire_time)

    return Token(access_token=access_token, token_type="bearer", refresh_token=refresh_token)
