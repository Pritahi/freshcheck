import type { Evidence } from "./types";

/**
 * Tavily Search API client - fetches live web evidence for one claim.
 * Free tier / hackathon credits cover this comfortably (one search per claim).
 */

const TAVILY_API_KEY = process.env.TAVILY_API_KEY ?? "";

export async function searchEvidence(query: string): Promise<Evidence[]> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: "basic",
      max_results: 4,
      include_answer: false,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Tavily error ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.results ?? []).map((r: Record<string, string>) => ({
    title: r.title ?? "",
    url: r.url ?? "",
    publishedDate: r.published_date,
    snippet: (r.content ?? "").slice(0, 400),
  }));
}
