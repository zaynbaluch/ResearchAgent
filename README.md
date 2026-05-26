# Multi-Agent Research Assistant

A full-stack, AI-powered business research assistant. The application uses a LangGraph multi-agent pipeline to validate queries, gather real-time data, and synthesize comprehensive reports.

## Architecture & Components

This project is decoupled into two primary components:

### 1. Backend (Python/FastAPI + LangGraph)
Located in the `/backend` directory, the backend manages the AI workflow and memory.
- **Framework:** FastAPI
- **Pipeline:** LangGraph with a 4-Agent setup (`Clarity` -> `Research` -> `Validator` -> `Synthesis`).
- **Memory:** SQLite checkpointer for multi-turn conversation memory and Human-in-the-Loop (HITL) interrupt routing.
- **APIs:** Groq LLM API for inference, Tavily Search API for data aggregation.

### 2. Frontend (Next.js 16 + React 19)
Located in the `/frontend` directory, the frontend provides a rich, dynamic user interface.
- **Framework:** Next.js (Turbopack) with React 19.
- **State Management:** Zustand.
- **Features:** 
  - Real-time Server-Sent Events (SSE) chat streaming.
  - Interactive Agent Pipeline visualization using React Flow.
  - Live data charting for research confidence using Recharts.

*For a detailed deep dive into how the multi-agent pipeline operates and the overall system design, please read the [Architecture Documentation](docs/architecture.md).*

---

## How to Run

### Prerequisites
- Python 3.10+
- Node.js 18+

### Step 1: Run the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Verify your API keys in the `backend/.env` file (`GROQ_API_KEY`, `TAVILY_API_KEY`).
5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *The API will be available at http://localhost:8000*

### Step 2: Run the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The UI will be available at http://localhost:3000*

---

## License
All rights reserved.
