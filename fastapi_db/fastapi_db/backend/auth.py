from datetime import datetime, timedelta, timezone
from backend.model import TokenData
from fastapi import status
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from typing import Annotated
from fastapi import Depends
from passlib.context import CryptContext
from sqlalchemy import select
from sqlmodel import Session
from backend.depend import get_session
from backend.model import User, RefreshToken


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth_scheme = OAuth2PasswordBearer(tokenUrl="/user/login/")

SECRET_KEY = 'ed60732905aeb0315e2f77d05a6cb57a0e408eaf2cb9a77a5a2667931c50d4e0'
ALGORITHYM = 'HS256'
EXPIRY_TIME = 15


def hash_password(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    print("verify_password ", plain_password, hashed_password)
    return pwd_context.verify(plain_password, hashed_password)


def get_user_from_db(session: Annotated[Session, Depends(get_session)],
                     username: str | None = None,
                     email: str | None = None):
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    print("get_user_from_db ", user)
    # if not user:
    #     statement = select(User).where(User.username == username)
    #     user = session.exec(statement).first()
    #     if user:
    #         return user
    return user


def authenticate_user(email,
                      password,
                      session: Annotated[Session, Depends(get_session)]):
    db_user = get_user_from_db(session=session, email=email)
    print(f""" authenticate {db_user} """)
    if not db_user:
        return False
    if not verify_password(password, db_user[0].password):
        return False
    return db_user[0]

#  ********************************* Creating Token *************************************


def create_access_token(data: dict, expiry_time: timedelta | None):
    data_to_encode = data.copy()
    if expiry_time:
        expire = datetime.now(timezone.utc) + expiry_time
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    data_to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        data_to_encode, SECRET_KEY, ALGORITHYM, )
    return encoded_jwt

#  ****************************** Decoding token and vaildating current user ********************************


def current_user(token: Annotated[str, Depends(oauth_scheme)],
                 session: Annotated[Session, Depends(get_session)]):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"error": "Invalid token, Please login again"},
        headers={"www-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHYM])
        username: str | None = payload.get("sub")

        if username is None:
            raise credential_exception
        token_data = TokenData(username=username)

    except JWTError:
        raise credential_exception
    user = get_user_from_db(session, username=token_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Invalid Credentials"},
            headers={"www-Authenticate": "Bearer"}
        )
    return user[0]


#  ***************************************** Refresh Token *************************************

def create_refresh_token(data: dict, expiry_time: timedelta | None):
    data_to_encode = data.copy()
    if expiry_time:
        expire = datetime.now(timezone.utc) + expiry_time
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    data_to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(data_to_encode, SECRET_KEY, ALGORITHYM)
    return encoded_jwt


def validate_refresh_token(token: str,
                           session: Annotated[Session, Depends(get_session)]):

    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token, Please login again",
        headers={"www-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, ALGORITHYM)
        email: str | None = payload.get("sub")
        if email is None:
            raise credential_exception
        token_data = RefreshToken(email=email)

    except:
        raise JWTError
    user = get_user_from_db(session, email=token_data.email)
    if not user:
        raise credential_exception
    return user
