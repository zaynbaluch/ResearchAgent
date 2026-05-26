// ============================================================
// Multi-Agent Research Assistant - Project Report
// ============================================================

#set document(
  title: "Multi-Agent Research Assistant – Project Report",
  author: "Muhammad Zain Abbas",
)

#set text(font: "New Computer Modern", size: 11pt)
#set page(paper: "a4", margin: (x: 2.5cm, y: 2.5cm))

// ────────────────────────────────────────────────────────────
//  TITLE PAGE
// ────────────────────────────────────────────────────────────

#page(margin: 0pt, header: none, footer: none)[
  #let primary   = rgb("#0D47A1")
  #let secondary = rgb("#1565C0")
  #let accent    = rgb("#42A5F5")
  #let pale      = rgb("#E3F2FD")
  #let highlight = rgb("#90CAF9")

  #place(top + left, dx: 0pt, dy: 0pt)[
    #rect(width: 100%, height: 100%, fill: white)
  ]

  #place(top + left, dx: -120pt, dy: 160pt)[
    #rotate(-28deg)[
      #rect(width: 950pt, height: 90pt, fill: primary.transparentize(88%), radius: 45pt)
    ]
  ]

  #place(top + left, dx: -80pt, dy: 260pt)[
    #rotate(-22deg)[
      #rect(width: 900pt, height: 60pt, fill: accent.transparentize(82%), radius: 30pt)
    ]
  ]

  #place(top + left, dx: -60pt, dy: 420pt)[
    #rotate(-18deg)[
      #rect(width: 880pt, height: 40pt, fill: highlight.transparentize(75%), radius: 20pt)
    ]
  ]

  #place(top + left, dx: -100pt, dy: 580pt)[
    #rotate(-30deg)[
      #rect(width: 950pt, height: 70pt, fill: secondary.transparentize(85%), radius: 35pt)
    ]
  ]

  #place(top + left, dx: -40pt, dy: 700pt)[
    #rotate(-15deg)[
      #rect(width: 850pt, height: 50pt, fill: pale.transparentize(30%), radius: 25pt)
    ]
  ]

  #place(top + right, dx: -60pt, dy: 80pt)[
    #circle(radius: 35pt, fill: accent.transparentize(85%))
  ]
  #place(bottom + left, dx: 50pt, dy: -120pt)[
    #circle(radius: 50pt, fill: highlight.transparentize(80%))
  ]
  #place(bottom + right, dx: -80pt, dy: -200pt)[
    #circle(radius: 25pt, fill: primary.transparentize(90%))
  ]

  #place(top + left)[
    #rect(width: 100%, height: 6pt, fill: gradient.linear(primary, accent, angle: 0deg))
  ]

  #place(bottom + left)[
    #rect(width: 100%, height: 6pt, fill: gradient.linear(accent, primary, angle: 0deg))
  ]

  #place(top + left, dx: 0pt, dy: 6pt)[
    #rect(width: 4pt, height: 100%, fill: gradient.linear(primary, accent, angle: 90deg))
  ]

  #align(center + horizon)[
    #block(width: 85%)[
      #v(18pt)
      #text(size: 16pt, weight: "bold", fill: primary)[
        Full Stack AI Application Development
      ]
      #v(4pt)
      #text(size: 12pt, fill: secondary)[
        Multi-Agent Research Assistant
      ]

      #v(20pt)
      #line(length: 60%, stroke: 1.5pt + accent)
      #v(20pt)

      #block(
        width: 100%,
        inset: (x: 20pt, y: 18pt),
        radius: 10pt,
        fill: gradient.linear(primary, secondary, angle: 135deg),
        stroke: none,
      )[
        #text(size: 20pt, weight: "bold", fill: white, tracking: 1pt)[
          Project Document
        ]
        #v(6pt)
        #text(size: 13pt, weight: "bold", fill: white)[
          AI-Powered Business Intelligence Platform
        ]
      ]

      #v(36pt)
      #line(length: 40%, stroke: 0.75pt + highlight)
      #v(16pt)

      #text(size: 11pt, weight: "bold", fill: primary)[Developed By]
      #v(10pt)

      #block(
        width: 100%,
        inset: (x: 16pt, y: 14pt),
        radius: 8pt,
        fill: pale.transparentize(40%),
        stroke: 0.75pt + accent,
      )[
        #set text(size: 11pt)
        #grid(
          columns: (1fr),
          row-gutter: 8pt,
          align: (center),

          text(weight: "bold", fill: secondary, size: 14pt)[Muhammad Zain Abbas],
          text(fill: primary, size: 11pt)[#link("mailto:mzabbas.bscs24seecs@seecs.edu.pk")[mzabbas.bscs24seecs\@seecs.edu.pk]]
        )
      ]
    ]
  ]
]

// ────────────────────────────────────────────────────────────
//  PAGE SETUP FOR REMAINING REPORT
// ────────────────────────────────────────────────────────────

#set page(
  margin: (x: 2.5cm, y: 2.5cm),
  header: context {
    if counter(page).get().first() > 1 [
      #set text(size: 8.5pt, fill: rgb("#1565C0"))
      #grid(
        columns: (1fr, 1fr),
        align: (left, right),
        [Multi-Agent Research Assistant],
        [Project Document],
      )
      #v(-4pt)
      #line(length: 100%, stroke: 0.5pt + rgb("#90CAF9"))
    ]
  },
  footer: context {
    set text(size: 8.5pt, fill: luma(120))
    grid(
      columns: (1fr, 1fr),
      align: (left, right),
      [],
      [Page #counter(page).display("1")],
    )
  },
)

#counter(page).update(1)

// ────────────────────────────────────────────────────────────
//  REUSABLE STYLING
// ────────────────────────────────────────────────────────────

#let task-blue    = rgb("#0D47A1")
#let sub-blue     = rgb("#1976D2")

#let section-heading(title) = {
  v(16pt)
  align(left)[
    #text(size: 16pt, weight: "bold", fill: task-blue)[#title]
  ]
  v(8pt)
}

#let sub-heading(label) = {
  v(10pt)
  align(left)[
    #text(size: 13pt, weight: "bold", fill: sub-blue)[#label]
  ]
  v(6pt)
}

// ────────────────────────────────────────────────────────────
//  1. INTRODUCTION & OVERVIEW
// ────────────────────────────────────────────────────────────

#section-heading("1. Introduction and Project Overview")

The Multi-Agent Research Assistant is an intelligent, full-stack application designed to automate the collection, validation, and synthesis of business intelligence data. By employing a LangGraph-based multi-agent pipeline on the backend and a reactive Next.js SPA on the frontend, the platform processes ambiguous user queries, fetches live web data, and streams formatted Markdown reports back to the user.

A critical feature of this system is its ability to recognize underspecified requests and trigger a Human-in-the-Loop (HITL) interrupt. If a query lacks necessary details (e.g., asking about a company without specifying its name), the system gracefully halts, prompts the user for clarification, and resumes its workflow seamlessly upon receiving the missing information.

#v(16pt)
#block(fill: rgb("#E3F2FD").transparentize(40%), inset: 12pt, radius: 8pt, width: 100%, stroke: 1pt + rgb("#90CAF9"))[
  #text(size: 12pt, weight: "bold", fill: task-blue)[Project Demonstration]
  #v(6pt)
  *Video Walkthrough:* #link("https://www.loom.com/share/707b315321bb4ffdabfd997ba34a87b4")[Watch the full working solution on Loom]
]

// ────────────────────────────────────────────────────────────
//  2. SYSTEM ARCHITECTURE & COMPONENTS
// ────────────────────────────────────────────────────────────

#section-heading("2. System Architecture & Components")

The project is decoupled into two primary domains: a robust Python backend and a dynamic React frontend.

#sub-heading("Backend: FastAPI & LangGraph")
The backend manages stateful agent workflows using Python's LangGraph and serves endpoints via FastAPI. 
- *Clarity Agent:* The entry point. It evaluates if the user's query is specific enough. If the query is ambiguous, it returns a `needs_clarification` status, triggering a human interrupt.
- *Research Agent:* Activated for clear queries. It utilizes the Tavily Search API to gather deep financial and news data, outputting findings alongside a confidence score (0-10).
- *Validator Agent:* Assesses the quality and completeness of the research. If the confidence is below 6, it triggers a retry loop back to the Research Agent.
- *Synthesis Agent:* Formats the validated research into a comprehensive, user-friendly Markdown response.
- *Persistence:* An `aiosqlite` database provides checkpointing for the LangGraph state, ensuring conversational memory and reliable recovery from human interrupts.

#sub-heading("Frontend: Next.js 16 & React 19")
The user interface is a Single Page Application tailored for real-time visualization and responsiveness.
- *Server-Sent Events (SSE):* Used to stream text tokens from the backend to the UI seamlessly, ensuring a low-latency chat experience.
- *Agent Pipeline Visualizer:* A real-time graph component built with `React Flow` that highlights the currently active agent and visualizes the complex routing (including bypasses and retries).
- *State Management:* Utilizes Zustand to globally manage chat history and agent status logic without excessive re-renders.

// ────────────────────────────────────────────────────────────
//  3. INSTALLATION & SETUP INSTRUCTIONS
// ────────────────────────────────────────────────────────────

#pagebreak()
#section-heading("3. Installation & Setup Instructions")

To run this application locally, you will need Python 3.10+ and Node.js 18+.

#sub-heading("Backend Setup")
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the backend directory and configure the API keys:
   ```env
   GROQ_API_KEY=your_groq_key_here
   TAVILY_API_KEY=your_tavily_key_here
   LLM_MODEL=openai/gpt-oss-120b
   CORS_ORIGINS=http://localhost:3000
   SQLITE_DB_PATH=checkpoints.db
   ```
5. Start the FastAPI server on port 8000:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

#sub-heading("Frontend Setup")
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary Node packages:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:3000`.

// ────────────────────────────────────────────────────────────
//  4. AI ASSISTANCE & PROMPTING STRATEGY
// ────────────────────────────────────────────────────────────

#section-heading("4. AI Assistance & Prompting Strategy")

This project was developed by leveraging an AI coding assistant. The development process was intentionally structured to provide the AI with highly detailed, predefined architectural constraints and UI specifications.

#sub-heading("Preparation: Documentation First")
Rather than heavily prompting the AI to "write an app from scratch" and hoping for the best, the groundwork was laid by manually writing comprehensive documentation *first*. Three core specification files were created in the `docs/` folder:
1. `assignment_details.md`: Detailed the exact functional requirements, outlining the exact logic and routing rules for the 4 LangGraph agents (Clarity, Research, Validator, Synthesis).
2. `ui-spec.md`: Specified the frontend architecture, component hierarchy, state management tools (Zustand), styling framework (Vanilla CSS + CSS Variables), and the required layout structure.
3. `ui-guidelines.md`: Outlined the aesthetic requirements, enforcing a dark-mode, glassmorphic design theme with specific color palettes and micro-animations.

#sub-heading("Execution: Simple Conversational Prompts")
Because the AI agents were provided with robust, self-written documentation upfront, the actual prompting process was incredibly streamlined. Instead of complex, multi-paragraph prompt engineering, the interaction felt like a simple conversation. The AI was directed to read the provided documentation and implement it step-by-step. 

Examples of the simple prompts used during development include:
- *"Read the docs folder and implement the frontend structure exactly as specified."*
- *"Now implement the backend LangGraph pipeline according to the assignment details."*
- *"The agent pipeline graph has a visual bug where the edges overlap the nodes. Fix the UI and make it collapsed by default."*

This "Docs-First" approach ensured that the AI strictly adhered to the desired architecture and aesthetic vision, reducing hallucinations and eliminating the need for excessive prompt tuning.
