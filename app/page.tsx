"use client";

import { useState } from "react";

interface Evidence {
  title: string;
  url: string;
  publishedDate?: string;
  snippet: string;
}

interface ClaimResult {
  claim: { id: string; text: string; category: string; timeSensitive: boolean };
  verdict: "FRESH" | "STALE" | "UNCERTAIN" | "STATIC";
  score: number;
  reason: string;
  evidence: Evidence[];
}

interface Report {
  answer: string;
  overallScore: number;
  totalClaims: number;
  checkedClaims: number;
  staleClaims: number;
  uncertainClaims: number;
  results: ClaimResult[];
  mode: "demo" | "live";
  generatedAt: string;
}

function scoreColor(score: number, verdict: string) {
  if (verdict === "STATIC") return "var(--grey)";
  if (score >= 70) return "var(--green)";
  if (score >= 40) return "var(--amber)";
  return "var(--red)";
}

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setReport(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="header">
        <h1>
          Fresh<span className="mark">Check</span>
        </h1>
        <p>
          Paste an AI-generated answer. FreshCheck extracts its claims, re-verifies the
          time-sensitive ones against live web sources, and scores how fresh the answer still is.
        </p>
      </div>

      <div className="card">
        <textarea
          placeholder="Paste any LLM answer here to verify it live against current web sources - or leave empty to run the canned demo answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button className="run" onClick={run} disabled={loading}>
          {loading
            ? "Checking freshness..."
            : answer.trim()
              ? "Check freshness (live)"
              : "Run canned demo"}
        </button>
        {error && <div className="error">{error}</div>}
      </div>

      {report && (
        <>
          <div className="card">
            <span className="mode-pill">{report.mode === "demo" ? "demo mode" : "live mode"}</span>
            <div className="score-hero">
              <div className="stat">
                <span
                  className="score-number"
                  style={{ color: scoreColor(report.overallScore, "FRESH") }}
                >
                  {report.overallScore}
                </span>
                <span className="score-label">overall freshness / 100</span>
              </div>
              <div className="stat">
                <b>{report.totalClaims}</b>
                <span className="score-label">claims found</span>
              </div>
              <div className="stat">
                <b>{report.checkedClaims}</b>
                <span className="score-label">re-verified live</span>
              </div>
              <div className="stat">
                <b style={{ color: "var(--red)" }}>{report.staleClaims}</b>
                <span className="score-label">stale</span>
              </div>
              <div className="stat">
                <b style={{ color: "var(--amber)" }}>{report.uncertainClaims}</b>
                <span className="score-label">uncertain</span>
              </div>
            </div>
          </div>

          {report.results.map((r) => (
            <div className="card" key={r.claim.id}>
              <div className="claim-head">
                <p className="claim-text">{r.claim.text}</p>
                <span className={`badge ${r.verdict}`}>{r.verdict}</span>
              </div>
              <div className="claim-meta">
                {r.claim.category.replace("_", " ")} · freshness {r.score}/100
              </div>
              {r.reason && <p className="reason">{r.reason}</p>}
              {r.evidence.length > 0 && (
                <ul className="evidence">
                  {r.evidence.map((e) => (
                    <li key={e.url}>
                      <a href={e.url} target="_blank" rel="noreferrer">
                        {e.title}
                      </a>{" "}
                      {e.publishedDate && <span className="date">({e.publishedDate})</span>}
                    </li>
                  ))}
                </ul>
              )}
              <div className="scorebar">
                <div
                  style={{
                    width: `${r.score}%`,
                    background: scoreColor(r.score, r.verdict),
                  }}
                />
              </div>
            </div>
          ))}

          <div className="footer">
            LLM calls route through a self-hosted <code>Bifrost</code> gateway (provider fallback +
            governance) · live evidence from <code>Tavily</code> · report generated{" "}
            {new Date(report.generatedAt).toLocaleString()}
          </div>
        </>
      )}
    </main>
  );
}
