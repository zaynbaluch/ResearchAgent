"""
AgentState — the central state schema flowing through the LangGraph pipeline.

Every node reads from and writes to this shared TypedDict.  The `messages`
field uses LangGraph's built-in message accumulator so conversation history
is automatically maintained across turns.
"""

from __future__ import annotations

from typing import Annotated, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """Shared state that flows between every node in the research graph."""

    # ── Conversation ──
    messages: Annotated[list[BaseMessage], add_messages]

    # ── Query Context ──
    query: str                          # Current user query
    company_name: str | None            # Extracted company name (if any)

    # ── Clarity ──
    clarity_status: str                 # "clear" | "needs_clarification"
    clarification_question: str | None  # Question to ask user (HITL)

    # ── Research ──
    research_findings: str | None       # Raw research data from Tavily + LLM
    confidence_score: float             # 0-10 confidence from Research Agent
    confidence_history: list[float]     # Track scores across retry attempts

    # ── Validation ──
    validation_result: str              # "sufficient" | "insufficient"
    validation_attempts: int            # Counter for retry loop (max 3)

    # ── Synthesis ──
    final_synthesis: str | None         # Final formatted answer

    # ── UI Metadata ──
    active_agent: str                   # Currently active agent (for frontend)
    agent_reasoning: list[dict]         # Per-agent reasoning traces
