"""
Application configuration — loads environment variables.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ── LLM ──
GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
LLM_MODEL: str = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")

# ── Search ──
TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")

# ── Server ──
CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# ── Persistence ──
SQLITE_DB_PATH: str = os.getenv("SQLITE_DB_PATH", "checkpoints.db")
