"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, User } from "lucide-react";
import type { Message } from "@/lib/types";

interface Props {
  message: Message;
}

/**
 * MessageBubble — renders a single chat message (user or agent).
 * Wrapped in React.memo to avoid re-rendering all messages when
 * unrelated store state (e.g. activeAgent) changes.
 */
const MessageBubble = memo(function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Agent avatar */}
      {!isUser && (
        <div
          className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg mt-0.5"
          style={{
            background: "linear-gradient(135deg, rgba(255,51,102,0.2), rgba(124,58,237,0.2))",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Sparkles size={13} style={{ color: "var(--gradient-1)" }} />
        </div>
      )}

      <div
        className={`max-w-[80%] ${isUser ? "max-w-[70%]" : ""}`}
        style={{
          background: isUser
            ? "var(--bg-elevated)"
            : "var(--bg-surface-transparent)",
          backdropFilter: isUser ? "none" : "blur(12px)",
          border: `1px solid ${isUser ? "rgba(255,255,255,0.08)" : "var(--border-subtle)"}`,
          borderRadius: isUser ? "12px 12px 4px 12px" : "4px 12px 12px 12px",
          padding: "0.75rem 1rem",
        }}
      >
        {/* Agent name header */}
        {!isUser && message.agentName && (
          <div
            className="flex items-center gap-1.5 mb-1.5"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-muted)",
              letterSpacing: "0.03em",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--gradient-1)" }}
            />
            Synthesis Agent
          </div>
        )}

        {/* Content */}
        {isUser ? (
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
            {message.content}
          </p>
        ) : (
          <div
            className="prose-agent text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        )}

        {/* Timestamp */}
        <div
          className="mt-1.5 text-right"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--text-muted)",
          }}
        >
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div
          className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg mt-0.5"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <User size={13} style={{ color: "var(--text-secondary)" }} />
        </div>
      )}
    </div>
  );
});

export default MessageBubble;
