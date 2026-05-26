"use client";

import { FlaskConical, Plus } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";

/**
 * Navbar — glassmorphic sticky top bar.
 */
export default function Navbar() {
  const startNewChat = useChatStore((s) => s.startNewChat);
  const isProcessing = useChatStore((s) => s.isProcessing);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-14 border-b"
      style={{
        background: "var(--bg-surface-transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "var(--grid-line-strong)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            background: "linear-gradient(135deg, var(--gradient-1), var(--gradient-2))",
          }}
        >
          <FlaskConical size={16} className="text-white" />
        </div>
        <span
          className="text-lg font-medium tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, var(--gradient-1), var(--gradient-2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Research Agent
        </span>
      </div>

      {/* New Chat Button */}
      <button
        onClick={startNewChat}
        disabled={isProcessing}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 hover:scale-[0.98] active:scale-[0.97] disabled:opacity-50"
        style={{
          color: "var(--text-secondary)",
          border: "1px solid var(--border-subtle)",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-focus)";
          e.currentTarget.style.background = "var(--bg-elevated)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-subtle)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <Plus size={14} />
        New Chat
      </button>
    </nav>
  );
}
