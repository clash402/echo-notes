# Echo Notes Backend

Backend API for Echo Notes - Record, transcribe, and organize your thoughts.

## Features

- **Audio Transcription**: Using OpenAI Whisper for high-quality speech-to-text
- **Text Summarization**: Using LangChain and OpenAI for intelligent text summarization
- **Note Management**: Full CRUD operations for notes with SQLite database
- **File Storage**: Secure audio file upload and storage
- **RESTful API**: FastAPI-based API with automatic documentation

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **Whisper**: OpenAI's speech recognition model
- **LangChain**: Framework for developing applications with LLMs
- **OpenAI**: GPT models for text summarization
- **ElevenLabs**: Text-to-speech integration (ready for future use)
- **uv**: Fast Python package installer and resolver

## Project Structure

```
├── data/                    # Sample audio files or transcripts
├── docs/                    # Flow diagrams, latency stats, summaries
├── src/
│   ├── agents/              # Whisper + summarization chains
│   ├── integrations/        # ElevenLabs API, optional cloud storage
│   ├── core/                # Configs, voice toggle, logging
│   ├── db/                  # SQLite models and query helpers
│   ├── storage/             # File/audio persistence layer
│   ├── models/              # Internal note and session types
│   ├── routers/             # /transcribe, /summarize, /notes
│   ├── schemas/             # TranscriptionRequest, NoteSummary
│   ├── services/            # Whisper transcription, summarizer
│   ├── utils/               # Token counter, language filters
│   └── main.py
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── unit/
└── pyproject.toml
```

## Setup

1. **Install dependencies**:
   ```bash
   uv sync
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run the development server**:
   ```bash
   uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Transcription
- `POST /api/transcribe` - Transcribe audio file

### Summarization
- `POST /api/summarize` - Summarize text

### Notes
- `GET /api/notes` - Get all notes (paginated)
- `POST /api/notes` - Create new note
- `GET /api/notes/{id}` - Get specific note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note

## Environment Variables

```env
# API Configuration
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Database
DATABASE_URL=sqlite:///./echo_notes.db

# Development
DEBUG=true
LOG_LEVEL=INFO
```

## Development

- **Run tests**: `uv run pytest`
- **Format code**: `uv run black src/`
- **Lint code**: `uv run ruff src/`
- **Type check**: `uv run mypy src/`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
