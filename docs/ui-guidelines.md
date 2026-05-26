# Research Agent — Design System & UI Guidelines

This document serves as the source of truth for the **Research Agent** aesthetic.

## 1. Design Philosophy

Research Agent uses a **High-Density, Glassmorphic Dark Mode** aesthetic inspired by modern developer tools (Vercel, Linear, Cursor). It emphasizes:

- **Depth**: Subtle borders, backdrop blurs, layered glassmorphic surfaces.
- **Motion**: Responsive agent transitions, streaming text, pulsing graph nodes.
- **Ambient Glow**: Soft background blobs and nebula gradients.
- **Precision**: High density, compact padding, visible structural grid.
- **Explainability**: Graph visualization, reasoning traces, and confidence scores are first-class.

## 2. Color Palette

### Base Colors (Dark Mode)
| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#000000` | Page background |
| `--bg-surface` | `#0A0A0C` | Card backgrounds |
| `--bg-surface-transparent` | `rgba(10, 10, 12, 0.6)` | Glassmorphic cards |
| `--bg-elevated` | `#111114` | Hover states |
| `--grid-line` | `rgba(255,255,255,0.08)` | Structural grid |
| `--grid-line-strong` | `rgba(255,255,255,0.15)` | Section borders |
| `--text-primary` | `#FFFFFF` | Headings, body |
| `--text-secondary` | `#A1A1AA` | Descriptions |
| `--text-muted` | `#52525B` | Captions, labels |
| `--border-subtle` | `rgba(255,255,255,0.12)` | Card borders |
| `--border-focus` | `rgba(255,255,255,0.3)` | Focus / hover borders |

### Semantic Colors
| Token | Value | Usage |
|---|---|---|
| `--success` | `#10B981` | Sufficient, clear |
| `--warning` | `#F59E0B` | Low confidence |
| `--danger` | `#EF4444` | Failed, errors |
| `--info` | `#06B6D4` | Informational |

### Agent Accent Colors
| Agent | Color | Hex |
|---|---|---|
| Clarity | Cyan | `#06B6D4` |
| Research | Violet | `#7C3AED` |
| Validator | Amber | `#F59E0B` |
| Synthesis | Rose | `#FF3366` |

### Gradients
- **Accent**: `linear-gradient(135deg, #FF3366, #7C3AED)`
- **Ribbon**: `linear-gradient(90deg, #FF3366, #7C3AED, #06B6D4)`

## 3. Typography

| Role | Font | Usage | Weight |
|---|---|---|---|
| Display | `Fraunces` | Headings, hero text | 400–500 |
| Body | `Inter` | UI text, buttons, nav | 400–600 |
| Mono | `JetBrains Mono` | Scores, agent names, code | 400–500 |

## 4. Key UI Patterns

### Structural Grid Background
Continuous 1px grid (64px cells) covering the entire page.

### Glassmorphic Surfaces
`backdrop-filter: blur(12px)`, `border: 1px solid var(--border-subtle)`, `border-radius: 12px`.

### Interactive Background
2–3 large gradient blobs with 200px+ blur, mouse parallax at 1/30 factor.

### Navbar
Sticky, `backdrop-filter: blur(16px)`, height `56px`.

## 5. Components

- **Primary Button**: White bg, scale(0.98) hover, 8px radius
- **Accent Button**: Gradient bg, animated shift on hover
- **Glass Card**: Translucent surface, hover translateY(-2px)
- **Badges**: `JetBrains Mono` 11px, pill radius, semantic colors
- **Inputs**: Dark surface, violet glow on focus

## 6. Animation Guidelines

- Transitions: `150ms`–`300ms`, `ease-in-out`
- Agent node pulse: 1.5s glow loop
- Streaming text: Blinking cursor
- Graph edges: Dotted → solid color sweep (~500ms)
- Respect `prefers-reduced-motion`

## 7. Spacing

Sidebar: `320px` · Graph panel: `200px` · Navbar: `56px` · Max content: `1280px`
