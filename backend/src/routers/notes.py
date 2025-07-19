from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db.database import get_db
from ..db.models import Note
from ..schemas.notes import NoteCreate, NoteUpdate, NoteResponse, NoteListResponse
from ..core.logging import get_logger

logger = get_logger("notes_router")
router = APIRouter()


@router.post("/notes", response_model=NoteResponse)
async def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    """Create a new note"""
    try:
        db_note = Note(
            title=note.title,
            content=note.content,
            audio_url=note.audio_url,
            transcript=note.transcript,
            summary=note.summary,
        )

        db.add(db_note)
        db.commit()
        db.refresh(db_note)

        logger.info(f"Created note with ID: {db_note.id}")
        return NoteResponse.from_orm(db_note)

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create note: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/notes", response_model=NoteListResponse)
async def get_notes(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get all notes with pagination"""
    try:
        offset = (page - 1) * size

        notes = (
            db.query(Note)
            .order_by(Note.created_at.desc())
            .offset(offset)
            .limit(size)
            .all()
        )
        total = db.query(Note).count()

        return NoteListResponse(
            notes=[NoteResponse.from_orm(note) for note in notes],
            total=total,
            page=page,
            size=size,
        )

    except Exception as e:
        logger.error(f"Failed to get notes: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/notes/{note_id}", response_model=NoteResponse)
async def get_note(note_id: int, db: Session = Depends(get_db)):
    """Get a specific note by ID"""
    try:
        note = db.query(Note).filter(Note.id == note_id).first()

        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        return NoteResponse.from_orm(note)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get note {note_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int, note_update: NoteUpdate, db: Session = Depends(get_db)
):
    """Update a note"""
    try:
        db_note = db.query(Note).filter(Note.id == note_id).first()

        if not db_note:
            raise HTTPException(status_code=404, detail="Note not found")

        # Update fields
        update_data = note_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_note, field, value)

        db.commit()
        db.refresh(db_note)

        logger.info(f"Updated note with ID: {note_id}")
        return NoteResponse.from_orm(db_note)

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update note {note_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/notes/{note_id}")
async def delete_note(note_id: int, db: Session = Depends(get_db)):
    """Delete a note"""
    try:
        db_note = db.query(Note).filter(Note.id == note_id).first()

        if not db_note:
            raise HTTPException(status_code=404, detail="Note not found")

        db.delete(db_note)
        db.commit()

        logger.info(f"Deleted note with ID: {note_id}")
        return {"message": "Note deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete note {note_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
