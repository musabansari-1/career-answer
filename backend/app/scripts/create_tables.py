from app.db.database import Base, engine
from app.models import document, chunk, chat

Base.metadata.create_all(bind=engine)

print("Tables created")