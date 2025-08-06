# 🗣️ Echo Notes – Backend API

**Echo Notes** lets users upload voice recordings, transcribe them using Whisper, and convert them into structured, searchable notes via LLM summarization.

---

## 🎯 Design Goals

- Clean FastAPI backend powered by OpenAI and LangChain
- Flexible support for audio upload, transcription, and summarization
- Persistent note search with optional tagging
- Unified architecture across all three portfolio projects
- Full cost visibility and smart usage limits

---

## 🏗 Architecture

- **FastAPI backend** for managing audio uploads, transcription, and note creation
- **Audio Upload**  
  - Users upload voice recordings via `POST /audio`
  - Files are stored locally in a structured `/storage/audio` directory
- **Transcription**  
  - OpenAI Whisper model is used via the OpenAI API to transcribe audio asynchronously
  - Transcripts are stored in `/storage/transcripts` and optionally cached
- **Summarization & Note Creation**  
  - Transcripts are passed to a LangChain summarization chain with a custom prompt
  - The resulting note includes structured fields: title, bullets, tags, action items
- **Prompt Templates**  
  - Stored in `.md` files inside `/prompts`, loaded using LangChain's `PromptTemplate`
- **Note Search & Tagging**  
  - Notes are stored in SQLite using SQLModel and can be searched by keywords or tags
  - Optional vector-based semantic search can be added using ChromaDB
- **Streaming & API Structure**  
  - Supports async processing and ready for streaming responses
  - Organized routers for `/audio`, `/notes`, and health endpoints
- **Usage Tracking & Cost Logging**  
  - Tracks prompt + completion token usage and estimated cost using a custom `CostTracker`
  - Costs stored in SQLite and aggregated monthly
- **Demo Mode Support**  
  - Blocks large uploads, forces cheaper models, and imposes monthly usage caps

---

## 📦 Tech Stack

- **FastAPI** – high-performance web framework for Python APIs
- **LangChain** – agent and prompt chaining framework
- **LangChain OpenAI** – integration layer for GPT and Whisper APIs
- **OpenAI Whisper** – speech-to-text transcription for voice input
- **ElevenLabs**: Text-to-speech integration (ready for future use)
- **SQLModel + SQLite** – data modeling and persistent note/usage storage
- **SQLAlchemy**: SQL toolkit and ORM
- **ChromaDB (optional)** – vector search database for semantic note retrieval
- **slowapi** – request-level rate limiting
- **httpx** – async HTTP client for OpenAI/Whisper API calls
- **python-multipart** – required for file upload handling
- **uvicorn** – ASGI server for running the FastAPI app
- **tenacity** – retry utility for robust API calls
- **uv** – fast package and environment manager (recommended)

---

## 📁 Project Structure

```
backend/
├── data/                      # Sample audio, transcripts
├── docs/                      # Sequence diagrams
├── src/
│   ├── agents/                # Summarizer prompt and logic
│   ├── core/                  # Settings, logging, LLM
│   ├── db/                    # SQLModel (notes, usage)
│   ├── integrations/          # TTS (optional), audio APIs
│   ├── models/                # Note, Tag, Usage tables
│   ├── prompts/               # summarizer_prompt.md
│   ├── routers/               # /audio, /notes
│   ├── schemas/               # AudioUpload, NoteCreate, etc.
│   ├── services/              # Whisper, summarizer, search
│   ├── storage/               # audio/, transcripts/, usage.db
│   └── main.py                # FastAPI entrypoint
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── unit/
└── pyproject.toml
```

---

## 🔧 Core Building Blocks

- **Multiple models (summary vs. transcribe):**
```python
settings.openai_models = {
  "default": "gpt-4o",
  "summary": "gpt-3.5-turbo"
}
```

- **LLM setup:**
```python
def get_llm(model: str | None = None):
    tracker = CostTracker()
    return ChatOpenAI(model=model or settings.openai_models["default"], callbacks=[tracker]), tracker
```

- **Prompt loading:**
```python
def load_template(name: str) -> PromptTemplate:
    return PromptTemplate.from_template((Path(__file__).parent.parent / "prompts" / name).read_text())
```

- **Summarization chain:**
```python
@router.post("/notes")
async def create_note(req: NoteCreate):
    prompt = load_template("summarizer_prompt.md")
    llm, tracker = get_llm(model=settings.openai_models["summary"])
    # Run LLM, log cost, store note
```

---

## 🛡 Operational Tips & Guardrails

- Input limits on audio duration and transcript size
- Summarizer uses `temperature=0` for consistency
- Prompts live in `/prompts` and are versioned
- Use structured schema for notes (title, bullets, tags)

---

## 💰 Cost Control Strategy

- **Per-user rate limiting** using `slowapi`
- **Global usage ceiling** tracked in SQLite via:
```sql
CREATE TABLE usage (timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, cost FLOAT);
```
- **Demo mode** uses cheaper models, blocks large files, and caps cost

---

## 🔌 API Endpoints

| Method | Route                        | Description                          |
|--------|------------------------------|--------------------------------------|
| GET    | /health                      | Health check                         |
| POST   | /audio                       | Upload audio                         |
| POST   | /audio/{id}/transcribe       | Transcribe uploaded audio            |
| POST   | /notes                       | Create structured note               |
| GET    | /notes                       | List/search notes                    |
| GET    | /notes/{id}                  | Get note detail                      |
| GET    | /usage                       | (Demo mode) Total usage              |

---

## 💡 Frontend Responsibilities

- Record/upload via `POST /audio`
- Transcribe with `POST /audio/{id}/transcribe`
- Summarize → `POST /notes`
- Fetch and search notes (`GET /notes`)
- Show usage info via `GET /usage`

---

## 🌍 Environment Variables

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

---

## 🚀 Features

- **Audio Transcription**: Using OpenAI Whisper for high-quality speech-to-text
- **Text Summarization**: Using LangChain and OpenAI for intelligent text summarization
- **Note Management**: Full CRUD operations for notes with SQLite database
- **File Storage**: Secure audio file upload and storage
- **RESTful API**: FastAPI-based API with automatic documentation

---

## 📦 Dependencies

- `fastapi`, `uvicorn[standard]`
- `langchain`, `langchain-openai`
- `sqlmodel`, `chromadb`, `pydantic`
- `slowapi`, `httpx`, `python-multipart`
- `openai` (for Whisper audio)

---

## ⚙️ Quick Start & Setup

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

---

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
