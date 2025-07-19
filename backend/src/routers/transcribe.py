from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
from ..db.database import get_db
from ..services.transcription import transcription_service
from ..storage.file_storage import file_storage
from ..schemas.transcription import TranscriptionRequest, TranscriptionResponse
from ..core.logging import get_logger

logger = get_logger("transcribe_router")
router = APIRouter()


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: Optional[str] = Form(None),
    model: Optional[str] = Form("base"),
    db: Session = Depends(get_db),
):
    """
    Transcribe uploaded audio file using Whisper
    """
    try:
        # Validate file
        if not audio.filename:
            raise HTTPException(status_code=400, detail="No audio file provided")

        # Check file type
        allowed_types = [".wav", ".mp3", ".m4a", ".webm", ".ogg"]
        file_extension = (
            audio.filename.lower().split(".")[-1] if "." in audio.filename else ""
        )
        if f".{file_extension}" not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_types)}",
            )

        logger.info(f"Processing transcription request for file: {audio.filename}")

        # Save uploaded file
        file_path = await file_storage.save_audio_file(audio)

        # Transcribe audio
        result = await transcription_service.transcribe_audio(file_path, language)

        logger.info(
            f"Transcription completed successfully. Text length: {len(result['text'])}"
        )

        return TranscriptionResponse(
            text=result["text"],
            confidence=result["confidence"],
            language=result["language"],
            duration=result["duration"],
        )

    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
