"use client";

import { useState } from "react";
import { PanelRightOpen, PanelRightClose, ChevronDown, ChevronUp } from "lucide-react";
import InteractiveBackground from "@/components/ui/InteractiveBackground";
import Navbar from "@/components/ui/Navbar";
import ChatWindow from "@/components/chat/ChatWindow";
import AgentGraphPanel from "@/components/graph/AgentGraphPanel";
import ReasoningSidebar from "@/components/sidebar/ReasoningSidebar";

/**
 * Main page — assembles navbar, graph panel, chat window, and reasoning sidebar.
 */
export default function Home() {
  const [showGraph, setShowGraph] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <InteractiveBackground />

      {/* Navbar */}
      <Navbar />

      {/* Main content area */}
      <div className="relative flex flex-1 min-h-0" style={{ zIndex: 1 }}>
        {/* Left column: Graph + Chat */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Graph Panel Toggle + Panel */}
          <div
            className="border-b px-4 py-2 flex items-center justify-between"
            style={{ borderColor: "var(--grid-line)" }}
          >
            <button
              onClick={() => setShowGraph((v) => !v)}
              className="flex items-center gap-1.5 text-xs transition-colors duration-150"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
                letterSpacing: "0.03em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              {showGraph ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              Agent Pipeline
            </button>

            {/* Sidebar toggle (for smaller screens or preference) */}
            <button
              onClick={() => setShowSidebar((v) => !v)}
              className="flex items-center gap-1.5 text-xs transition-colors duration-150 lg:hidden"
              style={{ color: "var(--text-muted)" }}
            >
              {showSidebar ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
            </button>
          </div>

          {/* Graph Panel (collapsible) */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out px-4"
            style={{
              maxHeight: showGraph ? "220px" : "0px",
              paddingTop: showGraph ? "12px" : "0px",
              paddingBottom: showGraph ? "12px" : "0px",
              opacity: showGraph ? 1 : 0,
            }}
          >
            <AgentGraphPanel />
          </div>

          {/* Chat Window */}
          <ChatWindow />
        </div>

        {/* Right column: Reasoning Sidebar */}
        <div
          className={`hidden lg:flex flex-col border-l transition-all duration-300 ease-in-out ${
            showSidebar ? "w-80" : "w-0 overflow-hidden"
          }`}
          style={{
            borderColor: "var(--grid-line-strong)",
            background: "var(--bg-surface)",
          }}
        >
          {showSidebar && <ReasoningSidebar />}
        </div>

        {/* Sidebar toggle for desktop */}
        <button
          onClick={() => setShowSidebar((v) => !v)}
          className="hidden lg:flex absolute top-2 right-2 items-center justify-center w-7 h-7 rounded-md z-10 transition-colors duration-150"
          style={{
            color: "var(--text-muted)",
            background: "var(--bg-surface-transparent)",
            border: "1px solid var(--border-subtle)",
            right: showSidebar ? "326px" : "8px",
            transition: "right 0.3s ease-in-out, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.borderColor = "var(--border-focus)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.borderColor = "var(--border-subtle)";
          }}
        >
          {showSidebar ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
        </button>
      </div>
    </div>
  );
}
