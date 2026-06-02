from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.search import SearchRequest, SearchResult
from app.services.search import search_chunks

router = APIRouter(prefix="/search", tags=["search"])


@router.post("/", response_model=list[SearchResult])
def search(query: SearchRequest, db: Session = Depends(get_db)):
    """Search for chunks matching the query text."""
    results = search_chunks(query.text, db)

    return [
        {
            "content": r[0].content,
            "score": r[1]
        }
        for r in results
    ]