"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Dot,
} from "recharts";
import { useChatStore } from "@/stores/chatStore";

/**
 * ConfidenceTimeline — sparkline showing confidence scores across retry attempts.
 */
export default function ConfidenceTimeline() {
  const confidenceHistory = useChatStore((s) => s.confidenceHistory);

  const data = useMemo(
    () =>
      confidenceHistory.map((score, i) => ({
        attempt: i + 1,
        score: Math.round(score * 10) / 10,
      })),
    [confidenceHistory]
  );

  if (data.length === 0) return null;

  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-medium"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
            letterSpacing: "0.03em",
          }}
        >
          Confidence Timeline
        </span>
        <span
          className="text-xs"
          style={{
            fontFamily: "var(--font-mono)",
            color: data[data.length - 1]?.score >= 6 ? "var(--success)" : "var(--warning)",
          }}
        >
          {data[data.length - 1]?.score}/10
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={70}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="attempt"
            tick={{ fontSize: 9, fill: "#52525B", fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 9, fill: "#52525B", fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            ticks={[0, 5, 10]}
          />
          <ReferenceLine
            y={6}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 4"
            label={{
              value: "threshold",
              position: "right",
              style: { fontSize: 8, fill: "#52525B", fontFamily: "'JetBrains Mono', monospace" },
            }}
          />
          <Tooltip
            contentStyle={{
              background: "#111114",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "6px",
              fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "#FFFFFF",
            }}
            formatter={(value) => [`${value}/10`, "Confidence"]}
            labelFormatter={(label) => `Attempt ${label}`}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="url(#confidenceGradient)"
            strokeWidth={2}
            dot={{ r: 4, fill: "#7C3AED", stroke: "#7C3AED", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#FF3366", stroke: "#FF3366" }}
          />
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
