from pydantic import BaseModel


class Citation(BaseModel):

    id: int

    source: str

    page: int

    snippet: str

    url: str


class ChatResponse(BaseModel):

    answer: str

    citations: list[Citation]