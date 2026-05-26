"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";

/**
 * ChatInput — auto-resizing textarea with gradient send button.
 */
export default function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const isProcessing = useChatStore((s) => s.isProcessing);
  const clarification = useChatStore((s) => s.clarification);

  const isDisabled = isProcessing || clarification.isActive;

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isDisabled) return;
    sendMessage(trimmed);
    setInput("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, isDisabled, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div
      className="relative flex items-end gap-2 rounded-xl p-3"
      style={{
        background: "var(--bg-surface-transparent)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={isDisabled ? "Waiting for agent..." : "Ask about any company..."}
        disabled={isDisabled}
        rows={1}
        className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed disabled:opacity-50"
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-body)",
          minHeight: "24px",
          maxHeight: "160px",
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={!input.trim() || isDisabled}
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 hover:scale-[0.95] active:scale-[0.9] disabled:opacity-30 disabled:hover:scale-100"
        style={{
          background: input.trim() && !isDisabled
            ? "linear-gradient(135deg, var(--gradient-1), var(--gradient-2))"
            : "var(--bg-elevated)",
        }}
      >
        <ArrowUp size={16} className="text-white" />
      </button>
    </div>
  );
}
