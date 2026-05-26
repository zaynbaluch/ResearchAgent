"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import ConfidenceTimeline from "./ConfidenceTimeline";

const AGENT_COLORS: Record<string, string> = {
  clarity: "#06B6D4",
  research: "#7C3AED",
  validator: "#F59E0B",
  synthesis: "#FF3366",
};

const AGENT_LABELS: Record<string, string> = {
  clarity: "Clarity Agent",
  research: "Research Agent",
  validator: "Validator Agent",
  synthesis: "Synthesis Agent",
};

/**
 * ReasoningSidebar — collapsible accordion of per-agent reasoning traces.
 */
export default function ReasoningSidebar() {
  const agentReasoning = useChatStore((s) => s.agentReasoning);
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Auto-expand latest entry
  const latestIndex = agentReasoning.length - 1;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "var(--grid-line-strong)" }}
      >
        <span
          className="text-xs font-medium tracking-wide uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          Agent Reasoning
        </span>
        {agentReasoning.length > 0 && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {agentReasoning.length}
          </span>
        )}
      </div>

      {/* Reasoning entries */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {agentReasoning.length === 0 && (
          <p
            className="text-xs text-center py-8"
            style={{ color: "var(--text-muted)" }}
          >
            Agent reasoning traces will appear here as the pipeline runs.
          </p>
        )}

        {agentReasoning.map((entry, i) => {
          const isExpanded = expandedIndices.has(i) || i === latestIndex;
          const color = AGENT_COLORS[entry.agent] || "var(--text-muted)";
          const label = AGENT_LABELS[entry.agent] || entry.agent;

          return (
            <div
              key={i}
              className="rounded-lg overflow-hidden animate-fade-in-up"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderLeft: `3px solid ${color}`,
              }}
            >
              {/* Header */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-3 py-2 text-left transition-colors duration-150"
                style={{ background: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-elevated)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {label}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown size={12} style={{ color: "var(--text-muted)" }} />
                ) : (
                  <ChevronRight size={12} style={{ color: "var(--text-muted)" }} />
                )}
              </button>

              {/* Body */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-1.5">
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {entry.reasoning}
                  </p>
                  <p
                    className="text-[10px]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {entry.decision}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Confidence Timeline */}
        <div className="mt-3">
          <ConfidenceTimeline />
        </div>
      </div>
    </div>
  );
}
