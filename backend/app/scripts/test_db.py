from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/career_answer"
engine = create_engine(DATABASE_URL)

with engine.connect():
    print("Connected!")