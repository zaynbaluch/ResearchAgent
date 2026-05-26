"""
Clarity Agent — evaluates whether the user's query is precise enough.

Checks if a company name is provided and whether the query is actionable.
Outputs clarity_status ("clear" / "needs_clarification") and routes
accordingly.
"""

from __future__ import annotations

from langchain_core.messages import SystemMessage
from langchain_groq import ChatGroq

from app.config import GROQ_API_KEY, LLM_MODEL
from app.graph.state import AgentState

SYSTEM_PROMPT = """You are the Clarity Agent in a multi-agent research assistant pipeline.

Your sole job is to evaluate the user's query and determine:
1. Is the query specific enough to research?
2. Is a company name explicitly provided or clearly identifiable?
3. Is the query actionable (not too vague)?

You must respond with EXACTLY this JSON format (no markdown, no extra text):
{
  "clarity_status": "clear" or "needs_clarification",
  "company_name": "extracted company name or null",
  "clarification_question": "question to ask user or null",
  "reasoning": "1-2 sentence explanation of your decision"
}

Rules:
- If the user mentions a specific company (e.g. "Tesla", "Apple", "SpaceX"), set status to "clear".
- If the query is a follow-up referencing a previous company in the conversation history, set status to "clear" and use the previously mentioned company.
- If no company is identifiable and the query is ambiguous, set status to "needs_clarification".
- The clarification_question should be helpful and specific, e.g. "Which company are you asking about?"
- Always include a brief reasoning trace.
"""


async def clarity_agent(state: AgentState) -> dict:
    """Evaluate query clarity and extract company name."""

    llm = ChatGroq(
        api_key=GROQ_API_KEY,
        model=LLM_MODEL,
        temperature=0,
    )

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        *state["messages"],
    ]

    response = await llm.ainvoke(messages)
    content = response.content.strip()

    # Parse the JSON response
    import json
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        # If LLM doesn't return valid JSON, treat as clear to avoid blocking
        parsed = {
            "clarity_status": "clear",
            "company_name": None,
            "clarification_question": None,
            "reasoning": "Failed to parse response; defaulting to clear.",
        }

    reasoning_entry = {
        "agent": "clarity",
        "reasoning": parsed.get("reasoning", "No reasoning provided."),
        "decision": f"{parsed['clarity_status']} → {'Interrupt' if parsed['clarity_status'] == 'needs_clarification' else 'Research Agent'}",
    }

    return {
        "clarity_status": parsed["clarity_status"],
        "company_name": parsed.get("company_name") or state.get("company_name"),
        "clarification_question": parsed.get("clarification_question"),
        "active_agent": "clarity",
        "agent_reasoning": state.get("agent_reasoning", []) + [reasoning_entry],
    }
