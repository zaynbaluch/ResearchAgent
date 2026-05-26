"""
Conditional edge functions — route the graph between agents based on state.
"""

from __future__ import annotations

from typing import Literal

from app.graph.state import AgentState


def route_after_clarity(state: AgentState) -> Literal["human_interrupt", "research"]:
    """After Clarity Agent: interrupt for clarification or proceed to research."""
    if state.get("clarity_status") == "needs_clarification":
        return "human_interrupt"
    return "research"


def route_after_research(state: AgentState) -> Literal["validator", "synthesis"]:
    """After Research Agent: validate if low confidence, else synthesise."""
    score = state.get("confidence_score", 0)
    if score < 6:
        return "validator"
    return "synthesis"


def route_after_validator(state: AgentState) -> Literal["research", "synthesis"]:
    """After Validator: loop back to research if insufficient (max 3), else synthesise."""
    result = state.get("validation_result", "sufficient")
    attempts = state.get("validation_attempts", 0)

    if result == "insufficient" and attempts < 3:
        return "research"
    return "synthesis"
