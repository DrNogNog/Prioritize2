from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.openai_api import call_openai

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str


@router.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        ai_response = await call_openai(req.message)

        return ChatResponse(
            reply=ai_response
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))