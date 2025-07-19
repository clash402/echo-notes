import whisper
import tempfile
import os
from pathlib import Path
from typing import Optional
from ..core.config import settings
from ..core.logging import get_logger

logger = get_logger("transcription")


class TranscriptionService:
    def __init__(self):
        self.model = None
        self.model_name = settings.whisper_model

    def _load_model(self):
        """Load Whisper model if not already loaded"""
        if self.model is None:
            logger.info(f"Loading Whisper model: {self.model_name}")
            self.model = whisper.load_model(self.model_name)
            logger.info("Whisper model loaded successfully")

    async def transcribe_audio(
        self, audio_file_path: str, language: Optional[str] = None
    ) -> dict:
        """
        Transcribe audio file using Whisper

        Args:
            audio_file_path: Path to the audio file
            language: Optional language code

        Returns:
            dict: Transcription result with text, confidence, and metadata
        """
        try:
            self._load_model()

            logger.info(f"Starting transcription of {audio_file_path}")

            # Transcribe with Whisper
            result = self.model.transcribe(
                audio_file_path,
                language=language,
                fp16=False,  # Use CPU for better compatibility
            )

            # Extract results
            transcription_text = result["text"].strip()
            language_detected = result.get("language", language)

            # Calculate confidence (average of segment confidences if available)
            confidence = 0.0
            if "segments" in result and result["segments"]:
                confidences = [seg.get("avg_logprob", 0) for seg in result["segments"]]
                confidence = sum(confidences) / len(confidences) if confidences else 0.0
                # Convert log probability to confidence (0-1 scale)
                confidence = min(1.0, max(0.0, (confidence + 1) / 2))

            # Get audio duration
            duration = None
            if "segments" in result and result["segments"]:
                duration = result["segments"][-1].get("end", 0)

            logger.info(
                f"Transcription completed. Text length: {len(transcription_text)}"
            )

            return {
                "text": transcription_text,
                "confidence": confidence,
                "language": language_detected,
                "duration": duration,
            }

        except Exception as e:
            logger.error(f"Transcription failed: {e}")
            raise Exception(f"Transcription failed: {str(e)}")


# Global instance
transcription_service = TranscriptionService()
