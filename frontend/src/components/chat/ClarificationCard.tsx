"use client";

import { useState } from "react";
import { ArrowRight, HelpCircle } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";

interface Props {
  question: string;
}

/**
 * ClarificationCard — styled inline HITL card with embedded input.
 * Appears in the chat flow when the Clarity Agent needs more information.
 */
export default function ClarificationCard({ question }: Props) {
  const [input, setInput] = useState("");
  const submitClarification = useChatStore((s) => s.submitClarification);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    submitClarification(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="animate-fade-in-up rounded-xl overflow-hidden"
      style={{
        background: "var(--bg-surface-transparent)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--border-subtle)",
        borderLeft: "3px solid var(--info)",
      }}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <HelpCircle size={16} style={{ color: "var(--info)" }} />
          <span
            className="text-xs font-medium tracking-wide"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--info)",
              letterSpacing: "0.03em",
            }}
          >
            Clarity Agent needs more information
          </span>
        </div>

        {/* Question */}
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {question}
        </p>

        {/* Input + Button */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your clarification..."
            className="flex-1 text-sm px-3 py-2 rounded-lg outline-none transition-all duration-200"
            style={{
              background: "var(--bg-surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-subtle)",
              fontFamily: "var(--font-body)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--border-focus)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(6, 182, 212, 0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.boxShadow = "none";
            }}
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white transition-all duration-150 hover:scale-[0.98] active:scale-[0.97] disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, var(--gradient-1), var(--gradient-2))",
            }}
          >
            Continue
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
