from pydantic import BaseModel


class SearchRequest(BaseModel):
    text: str


class SearchResult(BaseModel):
    content: str
    score: float
