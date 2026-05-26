"use client";

import { useRef, useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";
import MessageBubble from "./MessageBubble";
import ClarificationCard from "./ClarificationCard";
import ChatInput from "./ChatInput";
import { FlaskConical } from "lucide-react";

// Moved outside component — these never change and contain static labels/colors.
// Previously, new JSX icon elements were created on every render.
const AGENT_LABELS: Record<string, { label: string; color: string }> = {
  clarity: { label: "Clarity Agent", color: "var(--info)" },
  research: { label: "Research Agent", color: "var(--gradient-2)" },
  validator: { label: "Validator Agent", color: "var(--warning)" },
  synthesis: { label: "Synthesis Agent", color: "var(--gradient-1)" },
};

/**
 * ChatWindow — the main conversation area with messages, processing indicator, and input.
 */
export default function ChatWindow() {
  const messages = useChatStore((s) => s.messages);
  const isProcessing = useChatStore((s) => s.isProcessing);
  const activeAgent = useChatStore((s) => s.activeAgent);
  const clarification = useChatStore((s) => s.clarification);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing, clarification.isActive]);

  const isEmpty = messages.length === 0 && !isProcessing;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center animate-fade-in-up">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                style={{
                  background: "linear-gradient(135deg, rgba(255,51,102,0.15), rgba(124,58,237,0.15))",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <FlaskConical size={28} style={{ color: "var(--gradient-2)" }} />
              </div>
              <h1
                className="text-3xl font-medium tracking-tight mb-3"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                Research Agent
              </h1>
              <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>
                Ask me about any company — their latest news, financials, market position, competitors, and more. I&apos;ll research and synthesise the information for you.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {[
                  "Tell me about Tesla's latest quarterly results",
                  "What's happening with OpenAI recently?",
                  "Compare Apple and Microsoft's AI strategies",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => useChatStore.getState().sendMessage(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all duration-150 hover:scale-[0.98]"
                    style={{
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      background: "var(--bg-surface-transparent)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Processing indicator */}
          {isProcessing && activeAgent && (
            <div className="flex items-center gap-2 animate-fade-in-up" style={{ color: "var(--text-muted)" }}>
              <div
                className="w-2 h-2 rounded-full animate-glow-pulse"
                style={{ backgroundColor: AGENT_LABELS[activeAgent]?.color || "var(--text-muted)" }}
              />
              <span className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                {AGENT_LABELS[activeAgent]?.label || activeAgent} is working...
              </span>
            </div>
          )}

          {/* Clarification card */}
          {clarification.isActive && (
            <ClarificationCard question={clarification.question} />
          )}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
