from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from .core.config import settings
from .core.logging import setup_logging
from .db.database import init_db
from .routers import transcribe, summarize, notes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    setup_logging()
    await init_db()
    yield
    # Shutdown
    pass


app = FastAPI(
    title="Echo Notes API",
    description="Backend API for Echo Notes - Record, transcribe, and organize your thoughts",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(transcribe.router, prefix="/api", tags=["transcribe"])
app.include_router(summarize.router, prefix="/api", tags=["summarize"])
app.include_router(notes.router, prefix="/api", tags=["notes"])


@app.get("/")
async def root():
    return {"message": "Echo Notes API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
