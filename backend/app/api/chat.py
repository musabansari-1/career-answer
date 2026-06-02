from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.search import search_chunks
from app.services.llm import build_prompt, generate_answer

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    # 1. semantic search
    results = search_chunks(req.message, db, limit=5)
    chunks = [r[0].content for r in results]

    # 2. build conversation context
    history_text = "\n".join(
        [f"{m.role}: {m.content}" for m in req.history]
    )

    # 3. build prompt
    prompt = f"""
You are a helpful assistant.

Conversation history:
{history_text}

Context from documents:
{chr(10).join(chunks)}

User message:
{req.message}

Answer clearly and concisely.
"""

    # 4. generate response
    answer = generate_answer(prompt)

    return {"answer": answer}