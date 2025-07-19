from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..services.summarization import summarization_service
from ..schemas.transcription import SummarizationRequest, SummarizationResponse
from ..core.logging import get_logger

logger = get_logger("summarize_router")
router = APIRouter()


@router.post("/summarize", response_model=SummarizationResponse)
async def summarize_text(request: SummarizationRequest, db: Session = Depends(get_db)):
    """
    Summarize text using LangChain and OpenAI
    """
    try:
        logger.info(
            f"Processing summarization request. Text length: {len(request.text)}"
        )

        # Summarize text
        result = await summarization_service.summarize_text(
            text=request.text, max_length=request.max_length, style=request.style
        )

        logger.info("Summarization completed successfully")

        return SummarizationResponse(
            summary=result["summary"],
            key_points=result["key_points"],
            word_count=result["word_count"],
            original_length=result["original_length"],
        )

    except Exception as e:
        logger.error(f"Summarization failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
