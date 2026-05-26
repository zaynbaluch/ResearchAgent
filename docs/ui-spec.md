# Research Agent — UI/UX Specification

> **Design Language: "Nebula-Grid"**
>
> A fusion of Technical Elegance (structural grids, blueprint feel) and Ethereal Dynamics (ambient glows, flowing gradients), purpose-built for an AI multi-agent research interface.

---

## 1. Design Philosophy

### Core Principles
1. **Technical Elegance** — Visible 1px structural grid as a continuous blueprint behind all UI.
2. **Agent Transparency** — The multi-agent pipeline is always visible: graph nodes, reasoning traces, confidence metrics.
3. **Ethereal Dynamics** — Ambient glows and subtle animations create depth without overwhelming content.
4. **Extreme Contrast** — Pure black backgrounds with bright white text. Sharp, cinematic.
5. **Conversational Focus** — The chat interface is the hero. Everything else supports it.

### Vibe Keywords
`Premium` · `Agentic` · `Developer-focused` · `Precise` · `Cinematic` · `Explainable`

---

## 2. Global Design Tokens

See `ui-guidelines.md` for the complete color palette, typography, and spacing system. Key tokens:

```css
:root {
  --bg-base: #000000;
  --bg-surface: #0A0A0C;
  --bg-surface-transparent: rgba(10, 10, 12, 0.6);
  --bg-elevated: #111114;
  --grid-line: rgba(255, 255, 255, 0.08);
  --grid-line-strong: rgba(255, 255, 255, 0.15);
  --text-primary: #FFFFFF;
  --text-secondary: #A1A1AA;
  --text-muted: #52525B;
  --border-subtle: rgba(255, 255, 255, 0.12);
  --border-focus: rgba(255, 255, 255, 0.3);
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #06B6D4;
  --gradient-1: #FF3366;
  --gradient-2: #7C3AED;
  --gradient-3: #06B6D4;
  --font-display: 'Fraunces', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## 3. Core Layout — The Research Interface

The entire application is a **single-page chat interface** with supporting panels.

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR (glassmorphic, sticky)                                   │
│  🔬 Research Agent ·················· [+ New Chat]               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────┐ ┌────────────────┐  │
│  │                                         │ │                │  │
│  │  AGENT GRAPH PANEL (collapsible, top)   │ │  REASONING     │  │
│  │  [Clarity]──→[Research]──→[Validator]   │ │  SIDEBAR       │  │
│  │      ↓            ↑           │         │ │  (collapsible) │  │
│  │  [Interrupt]  (loop)          ↓         │ │                │  │
│  │                          [Synthesis]    │ │  Per-agent      │  │
│  │                              ↓          │ │  reasoning      │  │
│  │                           [Done]        │ │  traces         │  │
│  └─────────────────────────────────────────┘ │                │  │
│                                              │  Confidence     │  │
│  ┌─────────────────────────────────────────┐ │  Timeline       │  │
│  │                                         │ │  (sparkline)    │  │
│  │  CHAT WINDOW                            │ │                │  │
│  │                                         │ │                │  │
│  │  [User message bubble — right aligned]  │ │                │  │
│  │                                         │ │                │  │
│  │  [Agent response — left aligned,        │ │                │  │
│  │   glass card, markdown rendered,        │ │                │  │
│  │   with agent icon + name]               │ │                │  │
│  │                                         │ │                │  │
│  │  [Clarification Card — inline HITL      │ │                │  │
│  │   with input field + Continue btn]      │ │                │  │
│  │                                         │ │                │  │
│  │  [Streaming synthesis with cursor...]   │ │                │  │
│  │                                         │ │                │  │
│  ├─────────────────────────────────────────┤ │                │  │
│  │  CHAT INPUT                             │ │                │  │
│  │  [Auto-resize textarea] [Send ▶]       │ │                │  │
│  └─────────────────────────────────────────┘ └────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Specifications

### 4.1 Navbar

- **Position**: Sticky top, z-index 50
- **Background**: `var(--bg-surface-transparent)` + `backdrop-filter: blur(16px)`
- **Border**: `border-bottom: 1px solid var(--grid-line-strong)`
- **Height**: `56px`
- **Left**: Logo — "Research Agent" with gradient text (`--gradient-1` → `--gradient-2`), `Fraunces` 20px
- **Right**: "New Chat" button (ghost style) + optional theme toggle

### 4.2 Chat Window

- **Scrollable** container with auto-scroll to latest message
- **Background**: transparent (structural grid shows through)
- **Max width**: `800px`, centered within available space
- **Messages** have `16px` vertical gap

### 4.3 Message Bubbles

**User Messages:**
- Right-aligned
- Background: `var(--bg-elevated)` with subtle gradient border
- `Inter` 15px, `--text-primary`
- `border-radius: 12px 12px 4px 12px`
- Max width: `70%`

**Agent Messages (Synthesis):**
- Left-aligned
- Glass card style: `var(--bg-surface-transparent)` + `backdrop-filter: blur(12px)`
- `border: 1px solid var(--border-subtle)`
- `border-radius: 4px 12px 12px 12px`
- Includes: Agent icon (small colored dot) + agent name (`JetBrains Mono` 12px) in header
- Body: Rendered markdown with styled code blocks, lists, headers
- Max width: `80%`

**Streaming State:**
- Text appears token-by-token with a blinking cursor (`|`) at the end
- Cursor animation: `opacity: 0 → 1`, 700ms loop

### 4.4 Chat Input

- **Container**: Glass card at bottom, full width of chat area
- **Textarea**: Auto-resizing, `Inter` 15px, dark bg, placeholder "Ask about any company..."
- **Send Button**: Gradient accent circle (`--gradient-1` → `--gradient-2`), `ArrowUp` icon
- **Behavior**: Enter to send, Shift+Enter for newline, disabled during processing
- **Processing state**: Button shows spinner, textarea is readonly

### 4.5 Clarification Card (Human-in-the-Loop)

Appears inline in the chat flow when Clarity Agent requests clarification.

```
┌───────────────────────────────────────────────────┐
│ 🤔  The Clarity Agent needs more information       │  ← Header, cyan left border
│                                                   │
│ "Which company are you referring to? There are     │  ← Clarification question
│  multiple companies matching your query."          │     Inter 14px, --text-secondary
│                                                   │
│ ┌───────────────────────────────────────┐          │
│ │ Type your clarification...           │          │  ← Input field
│ └───────────────────────────────────────┘          │
│                              [Continue →]          │  ← Accent button
└───────────────────────────────────────────────────┘
```

- **Style**: Glass card with `3px` left border in `--info` (cyan)
- **Header**: `JetBrains Mono` 13px, cyan text, 🤔 emoji
- **Question**: `Inter` 14px, `--text-secondary`
- **Input**: Standard input component
- **Button**: `btn-accent` (small), disabled until input provided
- Submits to `/api/chat/clarify` and resumes the graph

### 4.6 Agent Graph Panel

A real-time visualization of the LangGraph state machine using ReactFlow.

- **Position**: Above chat window, collapsible (toggle button in top-right)
- **Height**: `180px` when expanded, `0` when collapsed
- **Background**: `var(--bg-surface)` with subtle border
- **Nodes**: 6 nodes — Clarity, Research, Validator, Synthesis, Interrupt, Done
- **Node styling**:
  - Default: Dark bg, subtle border, agent name in `JetBrains Mono` 11px
  - Waiting: Dimmed (`opacity: 0.4`)
  - **Active**: Gradient border glow (agent's accent color), pulse animation
  - Complete: Green checkmark overlay, full opacity
- **Edges**:
  - Default: Dashed, `--text-muted` color
  - **Active (routing)**: Animated solid line with agent color, particles flowing along edge
  - Loop edge (Validator → Research): Curved, shows retry count badge
- **Controls**: Minimap disabled, zoom controls bottom-right, fit-view on load
- **Non-interactive**: Read-only visualization (no dragging nodes)

### 4.7 Reasoning Sidebar

Collapsible right panel showing per-agent reasoning traces.

- **Width**: `320px`, collapsible to `0` (toggle button on left edge)
- **Background**: `var(--bg-surface)` + `border-left: 1px solid var(--grid-line-strong)`
- **Content**: Accordion of reasoning entries, one per agent per turn

**Each reasoning entry:**
```
┌──────────────────────────────────────┐
│ ● Clarity Agent                    ▼ │  ← Colored dot + name + expand toggle
├──────────────────────────────────────┤
│ "Query is specific. Company 'Tesla'  │  ← Reasoning text (Inter 13px)
│  identified. Routing to Research."   │
│                                      │
│ Decision: CLEAR → Research Agent     │  ← JetBrains Mono 12px, muted
└──────────────────────────────────────┘
```

- Colored left-border per agent (Cyan / Violet / Amber / Rose)
- Current turn auto-expanded, previous turns collapsed
- Smooth expand/collapse animation (200ms ease)

### 4.8 Confidence Timeline

Small sparkline chart showing confidence scores across Research Agent retries.

- **Position**: Inside reasoning sidebar, below the accordion
- **Size**: Full sidebar width × `80px` height
- **Library**: Recharts `LineChart`
- **X-axis**: Attempt number (1, 2, 3)
- **Y-axis**: Score 0–10
- **Line**: Gradient stroke (red at 0 → green at 10)
- **Dots**: Each data point shows a dot with score label
- **Only visible** when Research Agent has run ≥1 time
- **Threshold line**: Dashed horizontal line at score `6` (the routing threshold)

---

## 5. Animation & Dynamics

### 5.1 Interactive Background

- 2–3 large, extremely blurred (200px+) gradient blobs in corners
- Colors: `--gradient-1` (Rose), `--gradient-2` (Violet), `--gradient-3` (Cyan)
- Mouse parallax: Offset by `mousePos / 30`
- On mobile: Slow autonomous drift
- Disable on `prefers-reduced-motion`

### 5.2 Micro-Interactions

| Element | Animation | Duration |
|---|---|---|
| Message appear | Fade + slide up | 200ms ease-out |
| Card hover | Border brightens, translateY(-2px) | 200ms ease |
| Button press | scale(0.97) | 150ms ease |
| Button hover | scale(0.98) | 150ms ease |
| Agent node active | Glow pulse | 1.5s loop |
| Graph edge fire | Color sweep along path | 500ms ease |
| Sidebar expand | Width transition | 250ms ease-in-out |
| Graph panel expand | Height transition | 250ms ease-in-out |
| Skeleton loader | Gradient shimmer sweep | 1.5s loop |
| Confidence score | Count-up animation | 1s ease-out |
| Streaming text | Token-by-token + blinking cursor | 700ms cursor loop |

---

## 6. Responsive Behavior

| Breakpoint | Changes |
|---|---|
| `≥1280px` | Full layout: Chat + Graph panel + Reasoning sidebar |
| `1024–1279px` | Reasoning sidebar as overlay (toggle), graph panel stays |
| `768–1023px` | Graph panel collapsible, sidebar overlay, chat full-width |
| `<768px` | Sidebar hidden (accessible via button), graph in modal, full mobile chat |

### Mobile Adaptations
- Chat input sticks to bottom of viewport
- Graph visualization accessible via floating button → opens in a modal/sheet
- Reasoning traces accessible via floating button → opens in a bottom sheet
- Reduce grid to 128px cells
- Background blobs: Slower autonomous drift, reduced resolution

---

## 7. Accessibility & Performance

### Accessibility
- All interactive elements have `:focus-visible` ring (`--border-focus`)
- Color never conveys meaning alone — always paired with text/icons
- `prefers-reduced-motion`: Disable blobs, graph animations, count-ups
- Minimum WCAG AA contrast ratios

### Performance
- Background grid: Pure CSS, no JS
- Glassmorphism: Max 5 blurred surfaces visible simultaneously
- ReactFlow: Virtualized rendering, only visible nodes rendered
- Fonts: Preloaded with `<link rel="preload">`, display swap
- SSE stream: Uses `fetch` with `AbortController` for cleanup

---

*Last Updated: May 26, 2026*
