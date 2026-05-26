/**
 * API client — base URL and fetch helpers.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiUrl = (path: string) => `${API_BASE}${path}`;

/**
 * Send a chat message and return the raw Response for SSE streaming.
 */
export async function sendChatMessage(
  message: string,
  threadId: string | null,
  signal?: AbortSignal
): Promise<Response> {
  return fetch(apiUrl("/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      thread_id: threadId,
    }),
    signal,
  });
}

/**
 * Send a clarification response and return the raw Response for SSE streaming.
 */
export async function sendClarification(
  response: string,
  threadId: string,
  signal?: AbortSignal
): Promise<Response> {
  return fetch(apiUrl("/api/chat/clarify"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      response,
      thread_id: threadId,
    }),
    signal,
  });
}
