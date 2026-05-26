"""
Validator Agent — assesses research quality and completeness.

Determines whether the gathered data is sufficient to answer the user's
question.  If insufficient and retries remain, routes back to Research.
"""

from __future__ import annotations

import json

from langchain_core.messages import SystemMessage
from langchain_groq import ChatGroq

from app.config import GROQ_API_KEY, LLM_MODEL
from app.graph.state import AgentState

SYSTEM_PROMPT = """You are the Validator Agent in a multi-agent research assistant pipeline.

You evaluate the quality and completeness of research findings produced by the Research Agent.

Given the user's original query and the research findings, determine:
1. Are the findings relevant to the query?
2. Do the findings contain enough factual data to answer the query?
3. Are there significant gaps or missing information?

You must respond with EXACTLY this JSON format (no markdown, no extra text):
{
  "validation_result": "sufficient" or "insufficient",
  "reasoning": "1-2 sentence explanation of your assessment",
  "gaps": "Brief description of missing information, or null if sufficient"
}

Rules:
- Be strict but fair. If the findings cover the core of the query, mark as "sufficient".
- If the findings are vague, off-topic, or missing critical data, mark as "insufficient".
- Always provide clear reasoning for your decision.
"""


async def validator_agent(state: AgentState) -> dict:
    """Assess research quality and decide whether to loop back or proceed."""

    llm = ChatGroq(
        api_key=GROQ_API_KEY,
        model=LLM_MODEL,
        temperature=0,
    )

    findings = state.get("research_findings", "No findings available.")
    query = state.get("query", "")
    company = state.get("company_name", "Unknown")
    attempts = state.get("validation_attempts", 0)

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        SystemMessage(
            content=(
                f"User query: {query}\n"
                f"Company: {company}\n"
                f"Attempt: {attempts + 1} of 3\n\n"
                f"Research Findings:\n{findings}"
            )
        ),
    ]

    response = await llm.ainvoke(messages)
    content = response.content.strip()

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {
            "validation_result": "sufficient",
            "reasoning": "Could not parse response; defaulting to sufficient.",
            "gaps": None,
        }

    result = parsed.get("validation_result", "sufficient")
    new_attempts = attempts + 1

    # Determine routing decision for the reasoning trace
    if result == "insufficient" and new_attempts < 3:
        decision = f"Insufficient (attempt {new_attempts}/3) → Research Agent (retry)"
    elif result == "insufficient":
        decision = f"Insufficient but max attempts reached ({new_attempts}/3) → Synthesis Agent"
    else:
        decision = "Sufficient → Synthesis Agent"

    reasoning_entry = {
        "agent": "validator",
        "reasoning": parsed.get("reasoning", "No reasoning provided."),
        "decision": decision,
    }

    return {
        "validation_result": result,
        "validation_attempts": new_attempts,
        "active_agent": "validator",
        "agent_reasoning": state.get("agent_reasoning", []) + [reasoning_entry],
    }
