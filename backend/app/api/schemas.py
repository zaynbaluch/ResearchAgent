"""
Pydantic request / response schemas for the API.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """A new chat message from the user."""
    message: str = Field(..., min_length=1, description="The user's message")
    thread_id: str | None = Field(
        None,
        description="Thread ID for an existing conversation. If None, a new thread is created.",
    )


class ClarifyRequest(BaseModel):
    """User's response to a clarification prompt (HITL)."""
    response: str = Field(..., min_length=1, description="The user's clarification")
    thread_id: str = Field(..., description="Thread ID of the interrupted conversation")


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "research-agent"


class ThreadStateResponse(BaseModel):
    """Snapshot of the current graph state for a thread."""
    thread_id: str
    active_agent: str | None = None
    clarity_status: str | None = None
    company_name: str | None = None
    confidence_score: float | None = None
    confidence_history: list[float] = []
    validation_attempts: int = 0
    agent_reasoning: list[dict] = []
    is_interrupted: bool = False
    clarification_question: str | None = None
