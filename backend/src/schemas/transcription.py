from pydantic import BaseModel, Field
from typing import Optional


class TranscriptionRequest(BaseModel):
    language: Optional[str] = Field(None, description="Language code for transcription")
    model: Optional[str] = Field("base", description="Whisper model to use")


class TranscriptionResponse(BaseModel):
    text: str
    confidence: float
    language: Optional[str] = None
    duration: Optional[float] = None


class SummarizationRequest(BaseModel):
    text: str = Field(..., min_length=1)
    max_length: Optional[int] = Field(200, ge=50, le=1000)
    style: Optional[str] = Field(
        "concise", description="Summary style: concise, detailed, bullet_points"
    )


class SummarizationResponse(BaseModel):
    summary: str
    key_points: list[str]
    word_count: int
    original_length: int
