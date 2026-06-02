from sqlalchemy.orm import Session

from app.models.chat import ChatSession, ChatMessage
from app.services.search import search_chunks
from app.services.llm import generate_answer


def create_session(db: Session, title: str | None = None):
    session = ChatSession(title=title)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_sessions(db: Session):
    return db.query(ChatSession).all()


def get_messages(db: Session, session_id: str):
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .all()
    )


def add_message(db: Session, session_id: str, role: str, content: str):
    msg = ChatMessage(
        session_id=session_id,
        role=role,
        content=content
    )
    db.add(msg)
    db.commit()
    return msg


def chat_with_rag(db: Session, session_id: str, user_message: str):
    # 1. store user message
    add_message(db, session_id, "user", user_message)

    # 2. semantic search
    results = search_chunks(user_message, db, limit=5)
    context = "\n".join([r[0].content for r in results])

    # 3. get chat history
    history = get_messages(db, session_id)
    history_text = "\n".join(
        [f"{m.role}: {m.content}" for m in history]
    )

    # 4. prompt
    prompt = f"""
You are an AI assistant for answering questions based on documents.

Conversation:
{history_text}

Context:
{context}

User:
{user_message}

Answer clearly and concisely.
"""

    # 5. LLM response
    answer = generate_answer(prompt)

    # 6. store assistant message
    add_message(db, session_id, "assistant", answer)

    return answer