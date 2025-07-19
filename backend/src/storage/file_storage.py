import os
import shutil
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile
from ..core.config import settings
from ..core.logging import get_logger

logger = get_logger("storage")


class FileStorageService:
    def __init__(self):
        self.upload_dir = Path(settings.upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def save_audio_file(self, file: UploadFile) -> str:
        """
        Save uploaded audio file to storage

        Args:
            file: Uploaded file from FastAPI

        Returns:
            str: Path to saved file
        """
        try:
            # Validate file
            if not file.filename:
                raise ValueError("No filename provided")

            # Check file size
            file.file.seek(0, 2)  # Seek to end
            file_size = file.file.tell()
            file.file.seek(0)  # Reset to beginning

            if file_size > settings.max_file_size:
                raise ValueError(
                    f"File too large. Max size: {settings.max_file_size} bytes"
                )

            # Generate unique filename
            file_extension = Path(file.filename).suffix
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = self.upload_dir / unique_filename

            # Save file
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            logger.info(f"Audio file saved: {file_path}")
            return str(file_path)

        except Exception as e:
            logger.error(f"Failed to save audio file: {e}")
            raise

    def get_file_path(self, filename: str) -> Optional[Path]:
        """Get full path to a file by filename"""
        file_path = self.upload_dir / filename
        return file_path if file_path.exists() else None

    def delete_file(self, file_path: str) -> bool:
        """Delete a file from storage"""
        try:
            path = Path(file_path)
            if path.exists():
                path.unlink()
                logger.info(f"File deleted: {file_path}")
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to delete file {file_path}: {e}")
            return False

    def get_file_info(self, file_path: str) -> Optional[dict]:
        """Get file information"""
        try:
            path = Path(file_path)
            if path.exists():
                stat = path.stat()
                return {
                    "size": stat.st_size,
                    "created": stat.st_ctime,
                    "modified": stat.st_mtime,
                }
            return None
        except Exception as e:
            logger.error(f"Failed to get file info for {file_path}: {e}")
            return None


# Global instance
file_storage = FileStorageService()
