# from pydantic import BaseModel
# from typing import List, Literal


# class ChatMessage(BaseModel):
#     role: Literal["user", "assistant"]
#     content: str


# class ChatRequest(BaseModel):
#     message: str
#     history: List[ChatMessage] = []


# class ChatResponse(BaseModel):
#     answer: str



from pydantic import BaseModel
from typing import List, Literal, Optional


class ChatSessionCreate(BaseModel):
    title: Optional[str] = None


class ChatSessionOut(BaseModel):
    id: str
    title: Optional[str]


class ChatMessageIn(BaseModel):
    message: str


class ChatMessageOut(BaseModel):
    role: str
    content: str


class ChatSessionMessagesOut(BaseModel):
    session_id: str
    messages: List[ChatMessageOut]