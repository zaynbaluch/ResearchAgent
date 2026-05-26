/**
 * Zustand store — central state for the chat, agent graph, reasoning, and confidence.
 */

import { create } from "zustand";
import { sendChatMessage, sendClarification } from "@/lib/api";
import type {
  AgentName,
  AgentReasoning,
  AgentStatus,
  ClarificationState,
  Message,
  SSEEvent,
} from "@/lib/types";

interface ChatStore {
  // ── Chat ──
  messages: Message[];
  threadId: string | null;
  isProcessing: boolean;

  // ── Agent Graph ──
  agentStatuses: Record<AgentName, AgentStatus>;
  activeAgent: AgentName | null;

  // ── Reasoning ──
  agentReasoning: AgentReasoning[];

  // ── Confidence ──
  confidenceHistory: number[];

  // ── HITL ──
  clarification: ClarificationState;

  // ── Actions ──
  sendMessage: (content: string) => Promise<void>;
  submitClarification: (response: string) => Promise<void>;
  startNewChat: () => void;
  _processSSEStream: (response: Response) => Promise<void>;
}

const initialAgentStatuses: Record<AgentName, AgentStatus> = {
  clarity: "waiting",
  research: "waiting",
  validator: "waiting",
  synthesis: "waiting",
  interrupt: "waiting",
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  threadId: null,
  isProcessing: false,
  agentStatuses: { ...initialAgentStatuses },
  activeAgent: null,
  agentReasoning: [],
  confidenceHistory: [],
  clarification: { question: "", isActive: false },

  sendMessage: async (content: string) => {
    const { threadId, isProcessing } = get();
    if (isProcessing) return;

    // Add user message
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    set({
      messages: [...get().messages, userMsg],
      isProcessing: true,
      agentStatuses: { ...initialAgentStatuses },
      activeAgent: null,
      agentReasoning: [],
      confidenceHistory: [],
      clarification: { question: "", isActive: false },
    });

    try {
      const response = await sendChatMessage(content, threadId);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await get()._processSSEStream(response);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "agent",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
        agentName: "synthesis",
      };
      set({ messages: [...get().messages, errorMsg], isProcessing: false });
    }
  },

  submitClarification: async (response: string) => {
    const { threadId } = get();
    if (!threadId) return;

    // Add user clarification as a message
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: response,
      timestamp: new Date(),
    };

    set({
      messages: [...get().messages, userMsg],
      isProcessing: true,
      clarification: { question: "", isActive: false },
    });

    try {
      const res = await sendClarification(response, threadId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await get()._processSSEStream(res);
    } catch (err) {
      console.error("Clarification error:", err);
      set({ isProcessing: false });
    }
  },

  startNewChat: () => {
    set({
      messages: [],
      threadId: null,
      isProcessing: false,
      agentStatuses: { ...initialAgentStatuses },
      activeAgent: null,
      agentReasoning: [],
      confidenceHistory: [],
      clarification: { question: "", isActive: false },
    });
  },

  _processSSEStream: async (response: Response) => {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const event: SSEEvent = JSON.parse(jsonStr);

            switch (event.type) {
              case "thread_id":
                set({ threadId: event.thread_id });
                break;

              case "agent_start": {
                const agent = event.agent as AgentName;
                set((s) => ({
                  activeAgent: agent,
                  agentStatuses: {
                    ...s.agentStatuses,
                    [agent]: "active" as AgentStatus,
                  },
                }));
                break;
              }

              case "agent_complete": {
                const agent = event.agent as AgentName;
                set((s) => ({
                  agentStatuses: {
                    ...s.agentStatuses,
                    [agent]: "complete" as AgentStatus,
                  },
                }));
                break;
              }

              case "reasoning":
                set((s) => ({
                  agentReasoning: [
                    ...s.agentReasoning,
                    {
                      agent: event.agent,
                      reasoning: event.reasoning,
                      decision: event.decision,
                    },
                  ],
                }));
                break;

              case "confidence":
                set({
                  confidenceHistory: event.history,
                });
                break;

              case "synthesis": {
                const agentMsg: Message = {
                  id: crypto.randomUUID(),
                  role: "agent",
                  content: event.content,
                  timestamp: new Date(),
                  agentName: "synthesis",
                };
                set((s) => ({
                  messages: [...s.messages, agentMsg],
                }));
                break;
              }

              case "interrupt":
                set({
                  clarification: {
                    question: event.question,
                    isActive: true,
                  },
                  isProcessing: false,
                });
                break;

              case "done":
                set({ isProcessing: false });
                break;

              case "error":
                console.error("SSE error:", event.message);
                set({ isProcessing: false });
                break;
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } finally {
      reader.releaseLock();
      set({ isProcessing: false });
    }
  },
}));
