import { llmJson } from "./llm";
import { searchEvidence } from "./tavily";
import { buildReport } from "./report";
import type { Claim, ClaimResult, Evidence, Report, Verdict } from "./types";

/**
 * Live pipeline:
 *   extract claims (LLM via Bifrost)
 *   -> triage time-sensitive vs static
 *   -> Tavily search per time-sensitive claim
 *   -> verify claim vs evidence (LLM via Bifrost)
 *   -> score + report
 */

const EXTRACT_PROMPT = `You split an AI-generated answer into atomic, independently checkable claims.
For each claim output:
- text: the claim as a single self-contained sentence
- category: one of "pricing", "version", "regulation", "company", "date_sensitive", "static"
- timeSensitive: true if the claim could become outdated (prices, versions, laws, people, products, deadlines); false for timeless opinions or general practice
Return JSON: {"claims": [{"text": "...", "category": "...", "timeSensitive": true}]}. Maximum 8 claims.`;

const VERIFY_PROMPT = `You verify one claim against current web evidence.
Decide a verdict:
- FRESH: evidence clearly supports the claim as of today
- STALE: evidence clearly contradicts it, or names a newer fact that replaces it
- UNCERTAIN: evidence is missing, mixed, or only partially relevant
Also give a freshness score 0-100 (100 = fully current, 0 = definitively outdated) and a one-sentence reason that names what the current fact is.
Return JSON: {"verdict": "FRESH|STALE|UNCERTAIN", "score": 0, "reason": "..."}.`;

export async function verifyAnswer(answer: string): Promise<Report> {
  const extracted = await llmJson<{ claims: Omit<Claim, "id">[] }>([
    { role: "system", content: EXTRACT_PROMPT },
    { role: "user", content: answer },
  ]);

  const claims: Claim[] = (extracted.claims ?? []).slice(0, 8).map((c, i) => ({
    id: `c${i + 1}`,
    text: c.text,
    category: c.category,
    timeSensitive: c.timeSensitive,
  }));

  const results: ClaimResult[] = [];
  for (const claim of claims) {
    if (!claim.timeSensitive) {
      results.push({
        claim,
        verdict: "STATIC",
        score: 100,
        reason: "Not a time-sensitive fact; excluded from web verification.",
        evidence: [],
      });
      continue;
    }

    let evidence: Evidence[] = [];
    try {
      evidence = await searchEvidence(claim.text);
    } catch {
      results.push({
        claim,
        verdict: "UNCERTAIN",
        score: 50,
        reason: "Live web search failed; the claim could not be re-verified.",
        evidence: [],
      });
      continue;
    }

    const verdict = await llmJson<{ verdict: Verdict; score: number; reason: string }>([
      { role: "system", content: VERIFY_PROMPT },
      {
        role: "user",
        content: `CLAIM: ${claim.text}\n\nEVIDENCE:\n${evidence
          .map((e, i) => `[${i + 1}] ${e.title} (${e.url})${e.publishedDate ? ` - ${e.publishedDate}` : ""}\n${e.snippet}`)
          .join("\n\n")}`,
      },
    ]);

    const v: Verdict =
      verdict.verdict === "FRESH" || verdict.verdict === "STALE" ? verdict.verdict : "UNCERTAIN";
    results.push({
      claim,
      verdict: v,
      score: Math.max(0, Math.min(100, Math.round(verdict.score ?? 50))),
      reason: verdict.reason ?? "",
      evidence,
    });
  }

  return buildReport(answer, results, "live");
}
