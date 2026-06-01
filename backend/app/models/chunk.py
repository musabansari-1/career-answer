from sqlalchemy import Column, String, ForeignKey, Text
from app.db.database import Base
import uuid

class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"))
    content = Column(Text)