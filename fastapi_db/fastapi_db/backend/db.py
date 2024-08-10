from sqlmodel import SQLModel, create_engine
from backend.settings import DATABASE_URL

CONN_STR = str(DATABASE_URL).replace("postgresql", "postgresql+psycopg")

engine = create_engine(CONN_STR, connect_args={
                       "sslmode": "require"}, pool_recycle=300, pool_size=10)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
