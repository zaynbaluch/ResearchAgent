"""
FastAPI application entry-point.

Initialises the compiled LangGraph with SQLite persistence and
mounts the API router.
"""

from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager

import aiosqlite
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

from app.api.routes import router, set_graph
from app.config import CORS_ORIGINS, SQLITE_DB_PATH
from app.graph.builder import build_graph

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Compile the graph with SQLite checkpointer on startup."""
    async with aiosqlite.connect(SQLITE_DB_PATH, check_same_thread=False) as conn:
        checkpointer = AsyncSqliteSaver(conn)
        await checkpointer.setup()                # create tables if needed

        graph_builder = build_graph()
        compiled = graph_builder.compile(
            checkpointer=checkpointer,
            interrupt_before=["human_interrupt"],   # HITL pause point
        )
        set_graph(compiled)

        print("=" * 50)
        print("  [Research Agent] — Backend Ready")
        print(f"  [SQLite DB]: {SQLITE_DB_PATH}")
        print(f"  [CORS Origins]: {CORS_ORIGINS}")
        print("=" * 50)

        yield


# ── App ──
app = FastAPI(
    title="Research Agent API",
    description="Multi-agent research assistant powered by LangGraph",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ──
app.include_router(router)
