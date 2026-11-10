import type { Claim, ClaimResult, Evidence, Report } from "./types";
import { DEMO_CLAIMS, DEMO_EVIDENCE, DEMO_VERDICTS } from "./fixtures";

/**
 * Demo fixtures let the full UI run with zero API keys: the pipeline shape,
 * verdicts and evidence mirror a real run against a deliberately stale answer.
 */

export const DEMO_ANSWER = `To build a chat app in 2024, use Next.js 13 with the pages router - it is the latest stable version. OpenAI's GPT-4 API costs $0.03 per 1K input tokens. The EU AI Act was proposed in 2021 and is still under negotiation, so no compliance is needed yet. Elon Musk is the CEO of Twitter. You can store user sessions in localStorage; that is considered secure best practice.`;

export function demoReport(): Report {
  const results: ClaimResult[] = DEMO_CLAIMS.map((claim, i) => {
    if (!claim.timeSensitive) {
      return {
        claim,
        verdict: "STATIC",
        score: 100,
        reason: "General engineering opinion, not a time-sensitive fact. Not checked against the web.",
        evidence: [],
      };
    }
    const verdict = DEMO_VERDICTS[i];
    return {
      claim,
      verdict: verdict.verdict,
      score: verdict.score,
      reason: verdict.reason,
      evidence: DEMO_EVIDENCE[claim.id] ?? [],
    };
  });
  return buildReport(DEMO_ANSWER, results, "demo");
}

export function buildReport(answer: string, results: ClaimResult[], mode: "demo" | "live"): Report {
  const checked = results.filter((r) => r.claim.timeSensitive);
  const overall =
    checked.length === 0
      ? 100
      : Math.round(checked.reduce((sum, r) => sum + r.score, 0) / checked.length);
  return {
    answer,
    overallScore: overall,
    totalClaims: results.length,
    checkedClaims: checked.length,
    staleClaims: results.filter((r) => r.verdict === "STALE").length,
    uncertainClaims: results.filter((r) => r.verdict === "UNCERTAIN").length,
    results,
    mode,
    generatedAt: new Date().toISOString(),
  };
}

export type { Claim, ClaimResult, Evidence, Report };
