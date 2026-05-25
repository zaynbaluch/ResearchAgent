Assignment Guidelines & Deliverables

We designed this assignment to reflect the actual day-to-day challenges you would tackle as an intern with us.

Open-Resource Policy: You are completely free to use any AI tools (eg, Claude, Codex), search engines, or public frameworks you wish. In the modern tech landscape, knowing how to leverage AI effectively is a skill in itself.
Quality Expectation: We are looking for production-grade code. This means clean, readable, well-structured, and well-commented code that you would be proud to submit in a real-world production environment.
Academic Integrity: This assignment must be completed entirely on your own. Please do not collaborate with others, post the prompt on public forums, or share the contents of this email. You will be held liable if it happens.
Submission Format: Please reply directly to this email with a single ZIP folder containing:

All code and related files. Don't share on github or youtube.
A text document detailing any AI prompts you used and your reasoning behind them.
A short screen-recording video (eg, Loom) demonstrating your working solution.

Your Assignment to build Full Stack AI App:

Problem Statement Construct a multi-agent research assistant utilizing LangGraph that assists users in collecting data about businesses. The system must have multiple specialized agents collaborating, accommodate follow-up questions, and prompt the user for clarification when queries are ambiguous.

Specifications

1. Agent Architecture Develop 4 specialized agents:

a) Clarity Agent Evaluates whether the user's query is precise and specific. Verifies if a company name is provided or if the query is overly ambiguous. OUTPUT: Assigns clarity_status to "clear" or "needs_clarification" ROUTES TO: Interrupt (if unclear) OR Research Agent (if clear)

b) Research Agent Looks up company data (news, financials, recent developments). This agent must obtain this data via a search tool (Tavily MCP would be preferred). OUTPUT: Delivers research findings and assigns a confidence_score (0-10) ROUTES TO: Validator Agent (if confidence < 6) OR Synthesis Agent (if confidence ≥ 6)

c) Validator Agent Assesses research quality and completeness. Determines if the data is adequate to address the user's question. OUTPUT: Assigns validation_result to "sufficient" or "insufficient" ROUTES TO: Research Agent (loop back if insufficient AND attempts < 3) Synthesis Agent (if sufficient OR max attempts reached)

d) Synthesis Agent Consumes research findings and generates a coherent summary. Structures the response in an accessible format. Preserves context from conversation history. ROUTES TO: END

2. Essential Features to Develop

Multi-turn Conversation Sustain conversation history across various queries. Every agent must access prior messages for context. Handle follow-up questions like "What about their competitors?" or "Tell me more about the CEO"

Human-in-the-Loop (Interrupt) When the Clarity Agent identifies an ambiguous query, interrupt the workflow. Prompt the user for clarification (eg, "Which company are you asking about?") Continue processing after receiving the clarification.

State Management Employ an appropriate state schema that incorporates conversation data.

Conditional Routing Proper routing across the Clarity, Research & Validation agents based on their respective outputs.

Best regards,
Team Synapse AI Solutions