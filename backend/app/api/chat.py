from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.chat import (
    ChatSessionOut,
    ChatSessionMessagesOut,
    ChatMessageIn
)
from app.services.chat import (
    create_session,
    get_sessions,
    get_messages,
    chat_with_rag
)

router = APIRouter(prefix="/chat", tags=["chat"])


# CREATE SESSION
@router.post("/session", response_model=ChatSessionOut)
def new_session(db: Session = Depends(get_db)):
    return create_session(db)


# GET ALL SESSIONS
@router.get("/sessions", response_model=list[ChatSessionOut])
def sessions(db: Session = Depends(get_db)):
    return get_sessions(db)


# GET MESSAGES
@router.get("/session/{session_id}", response_model=ChatSessionMessagesOut)
def session_messages(session_id: str, db: Session = Depends(get_db)):
    messages = get_messages(db, session_id)

    return {
        "session_id": session_id,
        "messages": messages
    }


# SEND MESSAGE (RAG CORE)
# @router.post("/session/{session_id}/message")
# def send_message(
#     session_id: str,
#     req: ChatMessageIn,
#     db: Session = Depends(get_db)
# ):
#     answer = chat_with_rag(db, session_id, req.message)
#     return {"answer": answer}
@router.post("/session/{session_id}/message")
def send_message(session_id: str, req: ChatMessageIn, db: Session = Depends(get_db)):

    result = chat_with_rag(db, session_id, req.message)

    return result