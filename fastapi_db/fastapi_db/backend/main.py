from typing import Annotated
from fastapi import Depends, FastAPI
from sqlmodel import Session
from backend.depend import get_session
from backend.router import user
from .db import create_db_and_tables
from contextlib import asynccontextmanager


#  for front-end nextjs to access
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating tables..")
    create_db_and_tables()
    yield


app: FastAPI = FastAPI(
    lifespan=lifespan,
    title="User Service App",
    description="A simple User application",
    version="1.0.0",
    servers=[
        {
                "url": "http://localhost:8000",
                "description": "Development server"
        },
        {
            "url": "http://127.0.0.1:8000",
            "description": "Development server"
        }
    ]
)
#  for front-end nextjs to access
app.add_middleware(
    CORSMiddleware,
    # Replace with your frontend's origin
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    # Allow all HTTP methods (or specify the ones you need)
    allow_methods=["*"],
    allow_headers=["*"],  # Allow all headers (or specify the ones you need)
)

app.include_router(router=user.user_router)


@app.get("/")
def root():
    return {"message": "Hello World"}


# @app.get("/order")
# async def get_order(session: Annotated[Session, Depends(get_session)]):
#     """ This api will be getting user auth system """
#     return {"message": "Your Order has been place...  successfully ."}
