"""
Graph Builder — assembles the LangGraph StateGraph and compiles it
with an AsyncSqliteSaver checkpointer for persistent sessions.

Graph topology:
  START → clarity → [conditional] → research → [conditional] → synthesis → END
                       ↓                                ↑
                 human_interrupt           validator → (loop back)
"""

from __future__ import annotations

from langgraph.graph import END, START, StateGraph

from app.graph.agents.clarity import clarity_agent
from app.graph.agents.research import research_agent
from app.graph.agents.synthesis import synthesis_agent
from app.graph.agents.validator import validator_agent
from app.graph.routing import (
    route_after_clarity,
    route_after_research,
    route_after_validator,
)
from app.graph.state import AgentState


async def human_interrupt(state: AgentState) -> dict:
    """Placeholder node that the graph pauses BEFORE entering.

    When the graph is resumed after HITL clarification, this node
    simply passes through — the user's clarification has already been
    injected into the messages by the API layer.
    """
    return {
        "active_agent": "interrupt",
        "clarity_status": "clear",  # Mark as clear after user responds
    }


def build_graph() -> StateGraph:
    """Construct and return the (uncompiled) research agent graph."""

    builder = StateGraph(AgentState)

    # ── Add nodes ──
    builder.add_node("clarity", clarity_agent)
    builder.add_node("human_interrupt", human_interrupt)
    builder.add_node("research", research_agent)
    builder.add_node("validator", validator_agent)
    builder.add_node("synthesis", synthesis_agent)

    # ── Add edges ──
    builder.add_edge(START, "clarity")
    builder.add_conditional_edges("clarity", route_after_clarity)
    builder.add_edge("human_interrupt", "research")
    builder.add_conditional_edges("research", route_after_research)
    builder.add_conditional_edges("validator", route_after_validator)
    builder.add_edge("synthesis", END)

    return builder
