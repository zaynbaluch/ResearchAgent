"""
API routes — SSE streaming chat endpoint + HITL clarification endpoint.

Each chat request streams Server-Sent Events back to the client with
structured JSON payloads so the frontend can update the agent graph,
reasoning sidebar, and confidence timeline in real time.
"""

from __future__ import annotations

import json
import uuid

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage

from app.api.schemas import (
    ChatRequest,
    ClarifyRequest,
    HealthResponse,
    ThreadStateResponse,
)
from app.graph.builder import build_graph
from app.graph.state import AgentState

router = APIRouter(prefix="/api")

# ── Graph + Checkpointer (initialised at module level) ──
# The graph is compiled once with the SQLite checkpointer in main.py
# and injected here via `set_graph`.
_compiled_graph = None


def set_graph(graph):
    """Called from main.py after compiling with the checkpointer."""
    global _compiled_graph
    _compiled_graph = graph


def _get_graph():
    if _compiled_graph is None:
        raise RuntimeError("Graph not initialised. Call set_graph() first.")
    return _compiled_graph


# ── Helper: SSE formatting ──
def _sse(data: dict) -> str:
    """Format a dict as an SSE data line."""
    return f"data: {json.dumps(data)}\n\n"


# ── Health Check ──
@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse()


# ── Main Chat Endpoint (SSE) ──
@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Accept a user message, run the LangGraph pipeline, and stream
    agent events back as Server-Sent Events.
    """
    graph = _get_graph()
    thread_id = request.thread_id or str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    # Build the initial state for new conversations
    initial_input: dict = {
        "messages": [HumanMessage(content=request.message)],
        "query": request.message,
        "company_name": None,
        "clarity_status": "",
        "clarification_question": None,
        "research_findings": None,
        "confidence_score": 0.0,
        "confidence_history": [],
        "validation_result": "",
        "validation_attempts": 0,
        "final_synthesis": None,
        "active_agent": "",
        "agent_reasoning": [],
    }

    # If this is a continuation thread, only send the new message
    existing_state = await graph.aget_state(config)
    if existing_state and existing_state.values:
        initial_input = {
            "messages": [HumanMessage(content=request.message)],
            "query": request.message,
            # Reset pipeline fields for the new turn
            "clarity_status": "",
            "clarification_question": None,
            "research_findings": None,
            "confidence_score": 0.0,
            "validation_result": "",
            "validation_attempts": 0,
            "final_synthesis": None,
            "active_agent": "",
            "agent_reasoning": [],
        }

    async def event_generator():
        # Send thread_id first so the client knows which thread this is
        yield _sse({"type": "thread_id", "thread_id": thread_id})

        try:
            async for event in graph.astream(
                initial_input,
                config=config,
                stream_mode="updates",
            ):
                # `event` is a dict like {"node_name": {partial_state_update}}
                for node_name, state_update in event.items():
                    if node_name == "__interrupt__":
                        # Graph has been interrupted (HITL)
                        # Get the current state to find the clarification question
                        current = await graph.aget_state(config)
                        question = current.values.get(
                            "clarification_question",
                            "Could you please clarify your question?",
                        )
                        yield _sse({
                            "type": "interrupt",
                            "question": question,
                            "agent": "clarity",
                        })
                        continue

                    # Emit agent_start event
                    active = state_update.get("active_agent", node_name)
                    yield _sse({
                        "type": "agent_start",
                        "agent": active,
                    })

                    # Emit reasoning if available
                    reasoning_list = state_update.get("agent_reasoning", [])
                    if reasoning_list:
                        latest = reasoning_list[-1] if reasoning_list else None
                        if latest:
                            yield _sse({
                                "type": "reasoning",
                                "agent": latest.get("agent", active),
                                "reasoning": latest.get("reasoning", ""),
                                "decision": latest.get("decision", ""),
                            })

                    # Emit confidence if Research Agent
                    if active == "research" and "confidence_score" in state_update:
                        yield _sse({
                            "type": "confidence",
                            "score": state_update["confidence_score"],
                            "history": state_update.get("confidence_history", []),
                            "attempt": len(state_update.get("confidence_history", [])),
                        })

                    # Emit synthesis (final response)
                    if active == "synthesis" and "final_synthesis" in state_update:
                        yield _sse({
                            "type": "synthesis",
                            "content": state_update["final_synthesis"],
                        })

                    # Emit agent_complete
                    yield _sse({
                        "type": "agent_complete",
                        "agent": active,
                    })

        except Exception as e:
            yield _sse({"type": "error", "message": str(e)})

        # Final done event with full state
        try:
            final_state = await graph.aget_state(config)
            yield _sse({
                "type": "done",
                "thread_id": thread_id,
                "confidence_history": final_state.values.get("confidence_history", []),
                "agent_reasoning": final_state.values.get("agent_reasoning", []),
            })
        except Exception:
            yield _sse({"type": "done", "thread_id": thread_id})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ── Clarify Endpoint (Resume HITL) ──
@router.post("/chat/clarify")
async def clarify(request: ClarifyRequest):
    """
    Resume an interrupted graph after the user provides clarification.
    Streams SSE events as the pipeline continues from where it paused.
    """
    graph = _get_graph()
    config = {"configurable": {"thread_id": request.thread_id}}

    # Verify the thread exists and is interrupted
    current_state = await graph.aget_state(config)
    if not current_state or not current_state.next:
        raise HTTPException(
            status_code=400,
            detail="Thread is not in an interrupted state.",
        )

    # Inject the user's clarification into the state
    await graph.aupdate_state(
        config,
        {
            "messages": [HumanMessage(content=request.response)],
            "clarity_status": "clear",
            "query": request.response,
        },
    )

    async def event_generator():
        yield _sse({"type": "thread_id", "thread_id": request.thread_id})
        yield _sse({"type": "agent_start", "agent": "clarity"})

        try:
            # Resume the graph from the interrupt point
            async for event in graph.astream(
                None,
                config=config,
                stream_mode="updates",
            ):
                for node_name, state_update in event.items():
                    active = state_update.get("active_agent", node_name)

                    yield _sse({"type": "agent_start", "agent": active})

                    reasoning_list = state_update.get("agent_reasoning", [])
                    if reasoning_list:
                        latest = reasoning_list[-1]
                        yield _sse({
                            "type": "reasoning",
                            "agent": latest.get("agent", active),
                            "reasoning": latest.get("reasoning", ""),
                            "decision": latest.get("decision", ""),
                        })

                    if active == "research" and "confidence_score" in state_update:
                        yield _sse({
                            "type": "confidence",
                            "score": state_update["confidence_score"],
                            "history": state_update.get("confidence_history", []),
                            "attempt": len(state_update.get("confidence_history", [])),
                        })

                    if active == "synthesis" and "final_synthesis" in state_update:
                        yield _sse({
                            "type": "synthesis",
                            "content": state_update["final_synthesis"],
                        })

                    yield _sse({"type": "agent_complete", "agent": active})

        except Exception as e:
            yield _sse({"type": "error", "message": str(e)})

        try:
            final_state = await graph.aget_state(config)
            yield _sse({
                "type": "done",
                "thread_id": request.thread_id,
                "confidence_history": final_state.values.get("confidence_history", []),
                "agent_reasoning": final_state.values.get("agent_reasoning", []),
            })
        except Exception:
            yield _sse({"type": "done", "thread_id": request.thread_id})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ── Get Thread State ──
@router.get("/chat/{thread_id}/state", response_model=ThreadStateResponse)
async def get_thread_state(thread_id: str):
    """Return the current graph state for a given thread (for debugging/UI)."""
    graph = _get_graph()
    config = {"configurable": {"thread_id": thread_id}}

    state = await graph.aget_state(config)
    if not state or not state.values:
        raise HTTPException(status_code=404, detail="Thread not found.")

    values = state.values
    return ThreadStateResponse(
        thread_id=thread_id,
        active_agent=values.get("active_agent"),
        clarity_status=values.get("clarity_status"),
        company_name=values.get("company_name"),
        confidence_score=values.get("confidence_score"),
        confidence_history=values.get("confidence_history", []),
        validation_attempts=values.get("validation_attempts", 0),
        agent_reasoning=values.get("agent_reasoning", []),
        is_interrupted=bool(state.next),
        clarification_question=values.get("clarification_question"),
    )
