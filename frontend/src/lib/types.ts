/**
 * TypeScript interfaces for the Research Agent frontend.
 */

// ── SSE Event Types ──

export interface SSEThreadIdEvent {
  type: "thread_id";
  thread_id: string;
}

export interface SSEAgentStartEvent {
  type: "agent_start";
  agent: string;
}

export interface SSEAgentCompleteEvent {
  type: "agent_complete";
  agent: string;
}

export interface SSEReasoningEvent {
  type: "reasoning";
  agent: string;
  reasoning: string;
  decision: string;
}

export interface SSEConfidenceEvent {
  type: "confidence";
  score: number;
  history: number[];
  attempt: number;
}

export interface SSESynthesisEvent {
  type: "synthesis";
  content: string;
}

export interface SSEInterruptEvent {
  type: "interrupt";
  question: string;
  agent: string;
}

export interface SSEDoneEvent {
  type: "done";
  thread_id: string;
  confidence_history?: number[];
  agent_reasoning?: AgentReasoning[];
}

export interface SSEErrorEvent {
  type: "error";
  message: string;
}

export type SSEEvent =
  | SSEThreadIdEvent
  | SSEAgentStartEvent
  | SSEAgentCompleteEvent
  | SSEReasoningEvent
  | SSEConfidenceEvent
  | SSESynthesisEvent
  | SSEInterruptEvent
  | SSEDoneEvent
  | SSEErrorEvent;

// ── Domain Types ──

export type AgentName = "clarity" | "research" | "validator" | "synthesis" | "interrupt";
export type AgentStatus = "waiting" | "active" | "complete";

export interface AgentReasoning {
  agent: string;
  reasoning: string;
  decision: string;
}

export interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  agentName?: AgentName;
}

export interface ClarificationState {
  question: string;
  isActive: boolean;
}
