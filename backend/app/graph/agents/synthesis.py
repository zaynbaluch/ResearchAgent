"""
Synthesis Agent — generates a coherent, well-structured final answer.

Consumes research findings and full conversation history to produce a
markdown-formatted summary that the user sees as the final response.
"""

from __future__ import annotations

from langchain_core.messages import AIMessage, SystemMessage
from langchain_groq import ChatGroq

from app.config import GROQ_API_KEY, LLM_MODEL
from app.graph.state import AgentState

SYSTEM_PROMPT = """You are the Synthesis Agent in a multi-agent research assistant pipeline.

Your job is to take the research findings and produce a clear, well-structured,
and informative response for the user.

Guidelines:
1. Structure your response with clear markdown formatting (headers, bullet points, bold text).
2. Be comprehensive but concise — cover the key points without unnecessary filler.
3. Use the conversation history to understand context and handle follow-up questions naturally.
4. If the research findings are limited, acknowledge gaps honestly while providing what's available.
5. Include specific data points, numbers, and facts when available.
6. End with a brief note inviting follow-up questions if relevant.

Important: Respond DIRECTLY with the formatted answer. Do NOT wrap in JSON.
Write as if you are speaking directly to the user.
"""


async def synthesis_agent(state: AgentState) -> dict:
    """Generate the final coherent summary from research findings."""

    llm = ChatGroq(
        api_key=GROQ_API_KEY,
        model=LLM_MODEL,
        temperature=0.3,  # Slightly creative for better prose
    )

    findings = state.get("research_findings", "No findings available.")
    query = state.get("query", "")
    company = state.get("company_name", "")
    confidence = state.get("confidence_score", 0)
    attempts = state.get("validation_attempts", 0)

    context_note = (
        f"Research confidence: {confidence}/10 "
        f"(after {attempts} validation attempt(s))."
    )

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        SystemMessage(
            content=(
                f"User query: {query}\n"
                f"Company: {company}\n"
                f"{context_note}\n\n"
                f"Research Findings:\n{findings}"
            )
        ),
        *state["messages"],
    ]

    response = await llm.ainvoke(messages)
    synthesis = response.content.strip()

    reasoning_entry = {
        "agent": "synthesis",
        "reasoning": f"Generated final response based on research (confidence {confidence}/10).",
        "decision": "→ END",
    }

    return {
        "final_synthesis": synthesis,
        "active_agent": "synthesis",
        "messages": [AIMessage(content=synthesis)],
        "agent_reasoning": state.get("agent_reasoning", []) + [reasoning_entry],
    }
