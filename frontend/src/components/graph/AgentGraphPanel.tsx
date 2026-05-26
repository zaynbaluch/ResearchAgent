"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useChatStore } from "@/stores/chatStore";
import type { AgentName, AgentStatus } from "@/lib/types";

/**
 * AgentGraphPanel — real-time ReactFlow visualization of the LangGraph pipeline.
 */

const AGENT_COLORS: Record<string, string> = {
  clarity: "#06B6D4",
  research: "#7C3AED",
  validator: "#F59E0B",
  synthesis: "#FF3366",
  interrupt: "#06B6D4",
  done: "#10B981",
};

function getNodeStyle(status: AgentStatus, color: string) {
  const base = {
    background: "#0A0A0C", // Fully opaque dark background
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "11px",
    fontFamily: "'JetBrains Mono', monospace",
    color: "rgba(161, 161, 170, 0.4)", // Muted color for inactive agents
    minWidth: "110px",
    textAlign: "center" as const,
    transition: "all 0.3s ease",
  };

  if (status === "active") {
    return {
      ...base,
      border: `2px solid ${color}`,
      boxShadow: `0 0 15px ${color}30, 0 0 30px ${color}15`,
      color: "#FFFFFF",
      background: "#111114", // Fully opaque active background
    };
  }
  if (status === "complete") {
    return {
      ...base,
      border: `1px solid ${color}80`,
      color: color,
      background: "#111114", // Fully opaque completed background
    };
  }
  // Inactive
  return { ...base }; // Solid background, no opacity so lines behind are hidden
}

export default function AgentGraphPanel() {
  const agentStatuses = useChatStore((s) => s.agentStatuses);

  const nodes: Node[] = useMemo(
    () => [
      {
        id: "clarity",
        position: { x: 0, y: 45 },
        data: { label: "🔍 Clarity" },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: getNodeStyle(agentStatuses.clarity, AGENT_COLORS.clarity),
      },
      {
        id: "interrupt",
        position: { x: 120, y: 110 },
        data: { label: "⏸ Interrupt" },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: getNodeStyle(agentStatuses.interrupt, AGENT_COLORS.interrupt),
      },
      {
        id: "research",
        position: { x: 240, y: 10 },
        data: { label: "🔬 Research" },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: getNodeStyle(agentStatuses.research, AGENT_COLORS.research),
      },
      {
        id: "validator",
        position: { x: 380, y: 85 },
        data: { label: "✓ Validator" },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: getNodeStyle(agentStatuses.validator, AGENT_COLORS.validator),
      },
      {
        id: "synthesis",
        position: { x: 520, y: 45 },
        data: { label: "✨ Synthesis" },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: getNodeStyle(
          agentStatuses.synthesis,
          AGENT_COLORS.synthesis
        ),
      },
    ],
    [agentStatuses]
  );

  const edges: Edge[] = useMemo(() => {
    const isActive = (name: AgentName) => agentStatuses[name] === "active";
    const isComplete = (name: AgentName) => agentStatuses[name] === "complete";
    const edgeActive = (from: AgentName, to: AgentName) =>
      isComplete(from) || isActive(to);

    return [
      {
        id: "clarity-research",
        source: "clarity",
        target: "research",
        animated: edgeActive("clarity", "research"),
        style: {
          stroke: edgeActive("clarity", "research")
            ? AGENT_COLORS.clarity
            : "rgba(255,255,255,0.15)",
          strokeWidth: edgeActive("clarity", "research") ? 2 : 1,
        },
        markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12, color: edgeActive("clarity", "research") ? AGENT_COLORS.clarity : "rgba(255,255,255,0.15)" },
      },
      {
        id: "clarity-interrupt",
        source: "clarity",
        target: "interrupt",
        animated: agentStatuses.interrupt === "active",
        style: {
          stroke: agentStatuses.interrupt === "active"
            ? AGENT_COLORS.interrupt
            : "rgba(255,255,255,0.1)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
        markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: "rgba(255,255,255,0.15)" },
      },
      {
        id: "interrupt-research",
        source: "interrupt",
        target: "research",
        animated: false,
        style: {
          stroke: "rgba(255,255,255,0.1)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
        markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: "rgba(255,255,255,0.15)" },
      },
      {
        id: "research-validator",
        source: "research",
        target: "validator",
        animated: edgeActive("research", "validator"),
        style: {
          stroke: edgeActive("research", "validator")
            ? AGENT_COLORS.research
            : "rgba(255,255,255,0.15)",
          strokeWidth: edgeActive("research", "validator") ? 2 : 1,
        },
        markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12, color: edgeActive("research", "validator") ? AGENT_COLORS.research : "rgba(255,255,255,0.15)" },
      },
      {
        id: "validator-research",
        source: "validator",
        target: "research",
        type: "smoothstep",
        animated: agentStatuses.validator === "complete" && agentStatuses.research === "active",
        style: {
          stroke: "var(--warning)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
        label: "retry",
        labelStyle: { fontSize: 9, fill: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" },
        labelBgStyle: { fill: "#0A0A0C", fillOpacity: 0.8 },
        markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: "#F59E0B" },
      },
      {
        id: "research-synthesis",
        source: "research",
        target: "synthesis",
        animated: isComplete("research") && isActive("synthesis"),
        style: {
          stroke:
            isComplete("research") && isActive("synthesis")
              ? AGENT_COLORS.research
              : "rgba(255,255,255,0.1)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
        label: "high conf.",
        labelStyle: { fontSize: 9, fill: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" },
        labelBgStyle: { fill: "#0A0A0C", fillOpacity: 0.8 },
        markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: "rgba(255,255,255,0.15)" },
      },
      {
        id: "validator-synthesis",
        source: "validator",
        target: "synthesis",
        animated: edgeActive("validator", "synthesis"),
        style: {
          stroke: edgeActive("validator", "synthesis")
            ? AGENT_COLORS.validator
            : "rgba(255,255,255,0.15)",
          strokeWidth: edgeActive("validator", "synthesis") ? 2 : 1,
        },
        markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12, color: edgeActive("validator", "synthesis") ? AGENT_COLORS.validator : "rgba(255,255,255,0.15)" },
      },
    ];
  }, [agentStatuses]);

  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        height: "180px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={64} size={1} color="rgba(255,255,255,0.04)" />
        <Controls
          showInteractive={false}
          position="bottom-right"
          style={{ background: "var(--bg-surface)" }}
        />
      </ReactFlow>
    </div>
  );
}
