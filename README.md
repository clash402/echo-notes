# 📓 Echo Notes

**Voice-powered note-taking app that listens, thinks, and remembers.**
Echo Notes turns your voice into clean, searchable summaries—powered by LLMs and built to think with you.

Try it out! https://echo-notes-one.vercel.app/

---

## 💥 Real-World Use Case

> Speak your thoughts out loud—Echo Notes transcribes them, summarizes the key ideas, and organizes everything so you can search, revisit, or share with a click.

---

## 🧠 What It Does

- 🎤 **Voice Input** via Whisper
- 🧠 **Summarization** using OpenAI
- 🗂️ **Auto-tagging** and note categorization
- 🔎 **Search and history** across all your entries
- 🗣️ **Voice Output** via ElevenLabs (optional)

Built for developers, founders, and thinkers—whether you're brainstorming in the car, capturing late-night ideas, or just thinking out loud.

---

## 🚀 Why It Matters

We often lose our best thoughts when they’re spoken but not written down. Echo Notes helps you turn spontaneous thinking into structured knowledge—effortlessly.

Perfect for capturing fleeting ideas, organizing brain dumps, or recording project updates.

---

## 📈 Benefits

- Never lose your next big idea—just speak and let Echo Notes handle the rest
- Free your hands and mind—voice-first journaling, brainstorming, or capture
- Turn rambling voice notes into clean, structured summaries
- Built for clarity, privacy, and peace of mind

---

## 🔁 Flow Diagram

Visual diagram in progress – will show real-time voice → transcript → summary → search flow.

---

## 📜 Agent Log

Coming soon – sample session with detailed steps + logs.

---

## 🔐 Guardrails & Safety

Basic protections included to address common LLM concerns:

- 🔍 **Prompt sanitization** to avoid prompt injection
- 🧱 **Token limits** and early exits to avoid runaway costs
- 🧠 **Summarizer safeguards** to reduce hallucinations
- 🗣️ **Voice toggle** to turn off ElevenLabs output when not needed

---

## 💸 Token Cost Display

Each voice session displays token usage and estimated OpenAI cost for full transparency.

```bash
🧠 Transcription: 456 tokens  
📄 Summary: 812 tokens  
💵 Total cost: ~$0.023
```

---

## 📦 Reusability

Echo Notes is modular. The speech-to-text, summarization, tagging, and playback layers can be reused in other apps—from podcast processing to meeting recap tools.

---

## 🛠️ Tech Stack

- ****Frontend:**** Next.js, Tailwind CSS, React Query
- ****Backend:**** FastAPI (tool interfaces + execution logic)
- ****AI Framework:**** LangChain (retrieval + prompt chains)
- ****Storage:**** ChromaDB, SQLite
- ****LLM:**** OpenAI (can be swapped for open-source models)
- ****Tooling:**** GitHub API, mock Slack webhook, etc.
- ****Voice:**** Whisper (speech-to-text), ElevenLabs (text-to-speech)
- ****Deployment:**** Vercel (frontend) + Fly.io (backend)

---

## 🔑 Requirements

You’ll need API keys for:

- OpenAI (for transcription & summaries)
- ElevenLabs (for text-to-speech, optional)

---

## 💪 Setup

```bash
# clone the repo
git clone https://github.com/yourusername/echo-notes.git
cd taskflow

# set up environment variables
cp .env.example .env
```

## 🚀 Running Locally

You have several options to run the application locally:

### Option 1: Run Everything Together (Recommended)
```bash
# Start both frontend and backend with Docker Compose
./start.sh

# Stop all services
./stop.sh
```

### Option 2: Run Services Individually
```bash
# Start backend only
cd backend
./start.sh

# Start frontend only (in a separate terminal)
cd frontend
./start.sh
```

### Option 3: Manual Setup (Legacy)
```bash
# Install backend dependencies
cd backend
uv pip sync

# Run backend
uvicorn src.main:app --reload

# Install frontend dependencies (in a separate terminal)
cd frontend
npm install

# Run frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

---

## 🧑‍💻 Built By

Josh Courtney – Senior Full Stack Engineer\
[JoshCourtney.com](https://joshcourtney.com) | [LinkedIn](https://www.linkedin.com/in/joshcourtney402/)

