"""
Research Agent — looks up company data using Tavily search.

Searches for company news, financials, and recent developments, then
summarises findings and assigns a confidence_score (0-10).
"""

from __future__ import annotations

import json

from langchain_core.messages import SystemMessage
from langchain_groq import ChatGroq
from tavily import AsyncTavilyClient

from app.config import GROQ_API_KEY, LLM_MODEL, TAVILY_API_KEY
from app.graph.state import AgentState

SYSTEM_PROMPT = """You are the Research Agent in a multi-agent research assistant pipeline.

You have been given search results about a company. Your job is to:
1. Analyze the search results thoroughly.
2. Extract key information relevant to the user's query.
3. Summarise your findings in a structured format.
4. Assign a confidence_score from 0-10 based on how well the search results answer the query.

Confidence scoring guide:
- 8-10: Search results directly and comprehensively answer the query.
- 6-7: Search results partially answer the query with some gaps.
- 3-5: Search results are tangentially related but missing key information.
- 0-2: Search results are largely irrelevant to the query.

You must respond with EXACTLY this JSON format (no markdown, no extra text):
{
  "research_findings": "Your structured findings in markdown format",
  "confidence_score": 7.5,
  "reasoning": "1-2 sentence explanation of your confidence assessment"
}
"""


async def research_agent(state: AgentState) -> dict:
    """Search for company data via Tavily and summarise findings."""

    # ── Step 1: Search with Tavily ──
    tavily = AsyncTavilyClient(api_key=TAVILY_API_KEY)

    company = state.get("company_name") or ""
    query = state.get("query", "")
    search_query = f"{company} {query}".strip()

    try:
        search_results = await tavily.search(
            query=search_query,
            max_results=5,
            include_answer=True,
        )
    except Exception as e:
        search_results = {"results": [], "answer": f"Search failed: {str(e)}"}

    # Format search results for the LLM
    formatted_results = []
    for result in search_results.get("results", []):
        formatted_results.append(
            f"**{result.get('title', 'Untitled')}**\n"
            f"URL: {result.get('url', 'N/A')}\n"
            f"{result.get('content', 'No content')}\n"
        )

    search_context = "\n---\n".join(formatted_results) if formatted_results else "No search results found."
    tavily_answer = search_results.get("answer", "")

    # ── Step 2: Summarise with LLM ──
    llm = ChatGroq(
        api_key=GROQ_API_KEY,
        model=LLM_MODEL,
        temperature=0,
    )

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        SystemMessage(content=f"User's query: {query}\nCompany: {company}\n\nTavily AI Answer:\n{tavily_answer}\n\nSearch Results:\n{search_context}"),
        *state["messages"],
    ]

    response = await llm.ainvoke(messages)
    content = response.content.strip()

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        parsed = {
            "research_findings": content,
            "confidence_score": 5.0,
            "reasoning": "Could not parse structured response; using raw output.",
        }

    confidence = float(parsed.get("confidence_score", 5.0))
    confidence_history = state.get("confidence_history", []) + [confidence]

    reasoning_entry = {
        "agent": "research",
        "reasoning": parsed.get("reasoning", "No reasoning provided."),
        "decision": f"Confidence: {confidence}/10 → {'Validator' if confidence < 6 else 'Synthesis Agent'}",
    }

    return {
        "research_findings": parsed.get("research_findings", content),
        "confidence_score": confidence,
        "confidence_history": confidence_history,
        "active_agent": "research",
        "agent_reasoning": state.get("agent_reasoning", []) + [reasoning_entry],
    }
