/**
 * LLM client. All real model traffic goes through a self-hosted Bifrost
 * gateway (OpenAI-compatible endpoint). Bifrost owns provider keys,
 * fallback (groq -> gemini) and request governance logs, so this app
 * only ever talks to one endpoint.
 */

const BIFROST_URL = process.env.BIFROST_URL ?? "http://localhost:8080/v1";
const BIFROST_MODEL = process.env.BIFROST_MODEL ?? "groq/llama-3.3-70b-versatile";

export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

export async function llmJson<T>(messages: ChatMessage[], maxTokens = 2000): Promise<T> {
  const res = await fetch(`${BIFROST_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: BIFROST_MODEL,
      messages,
      temperature: 0,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Bifrost gateway error ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";
  return parseJson<T>(content);
}

export function parseJson<T>(raw: string): T {
  // Tolerate models wrapping JSON in prose or fences.
  const match = raw.match(/[\[{][\s\S]*[\]}]/);
  if (!match) throw new Error(`LLM returned no JSON: ${raw.slice(0, 200)}`);
  return JSON.parse(match[0]) as T;
}
