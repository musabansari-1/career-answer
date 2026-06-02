import uuid
from sqlalchemy import Column, String, Text, ForeignKey
from app.db.database import Base


def generate_id():
    return str(uuid.uuid4())


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=generate_id)
    title = Column(String, nullable=True)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=generate_id)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)

    role = Column(String, nullable=False)  # "user" | "assistant"
    content = Column(Text, nullable=False)