# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session

# from app.db.session import get_db
# from app.schemas.chat import (
#     ChatSessionOut,
#     ChatSessionMessagesOut,
#     ChatMessageIn
# )
# from app.services.chat import (
#     create_session,
#     get_sessions,
#     get_messages,
#     chat_with_rag
# )

# router = APIRouter(prefix="/chat", tags=["chat"])


# # CREATE SESSION
# @router.post("/session", response_model=ChatSessionOut)
# def new_session(db: Session = Depends(get_db)):
#     return create_session(db)


# # GET ALL SESSIONS
# @router.get("/sessions", response_model=list[ChatSessionOut])
# def sessions(db: Session = Depends(get_db)):
#     return get_sessions(db)


# # GET MESSAGES
# @router.get("/session/{session_id}", response_model=ChatSessionMessagesOut)
# def session_messages(session_id: str, db: Session = Depends(get_db)):
#     messages = get_messages(db, session_id)

#     return {
#         "session_id": session_id,
#         "messages": messages
#     }


# @router.post("/session/{session_id}/message")
# def send_message(session_id: str, req: ChatMessageIn, db: Session = Depends(get_db)):

#     result = chat_with_rag(db, session_id, req.message)

#     return result



from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

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
    chat_with_rag,
    stream_chat_with_rag
)

from app.models.chat import ChatSession, ChatMessage

router = APIRouter(prefix="/chat", tags=["chat"])


# ---------------------------
# CREATE SESSION
# ---------------------------
@router.post("/session", response_model=ChatSessionOut)
def new_session(db: Session = Depends(get_db)):
    return create_session(db)


# ---------------------------
# GET ALL SESSIONS
# ---------------------------
@router.get("/sessions", response_model=list[ChatSessionOut])
def sessions(db: Session = Depends(get_db)):
    return get_sessions(db)


# ---------------------------
# GET SESSION MESSAGES
# ---------------------------
@router.get("/session/{session_id}", response_model=ChatSessionMessagesOut)
def session_messages(session_id: str, db: Session = Depends(get_db)):
    messages = get_messages(db, session_id)

    return {
        "session_id": session_id,
        "messages": messages
    }


# ---------------------------
# SEND MESSAGE (RAG)
# ---------------------------
@router.post("/session/{session_id}/message")
def send_message(
    session_id: str,
    req: ChatMessageIn,
    db: Session = Depends(get_db)
):
    result = chat_with_rag(db, session_id, req.message)
    return result


@router.post("/session/{session_id}/stream")
def stream_message(
    session_id: str,
    req: ChatMessageIn,
    db: Session = Depends(get_db),
):
    print("STREAM ENDPOINT HIT")
    return StreamingResponse(
        stream_chat_with_rag(
            db,
            session_id,
            req.message,
        ),
        media_type="text/plain",
    )


# =====================================================
# NEW: RENAME SESSION
# =====================================================

class RenameSessionRequest(BaseModel):
    title: str


@router.put("/session/{session_id}")
def rename_session(
    session_id: str,
    req: RenameSessionRequest,
    db: Session = Depends(get_db)
):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    session.title = req.title
    db.commit()
    return {"success": True}


# =====================================================
# NEW: DELETE SESSION
# =====================================================

@router.delete("/session/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    # delete messages first
    db.query(ChatMessage).filter(ChatMessage.session_id == session_id).delete()

    # delete session
    db.query(ChatSession).filter(ChatSession.id == session_id).delete()

    db.commit()

    return {"success": True}

