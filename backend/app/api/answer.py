from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.answer import AnswerRequest, AnswerResponse
from app.services.search import search_chunks
from app.services.llm import build_prompt, generate_answer

router = APIRouter(prefix="/answer", tags=["answer"])


@router.post("/", response_model=AnswerResponse)
def answer(req: AnswerRequest, db: Session = Depends(get_db)):
    # STEP 1: retrieve relevant chunks
    results = search_chunks(req.question, db, limit=5)

    chunks = [r[0].content for r in results]

    # STEP 2: build prompt
    prompt = build_prompt(req.question, chunks)

    # STEP 3: call LLM
    answer_text = generate_answer(prompt)

    return {"answer": answer_text}