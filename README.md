# FreshCheck — Stale-Answer Detector for AI Applications

> Geek Room Global AI Hackathon 2026 · Problem statement: **"Build a Stale-Answer Detector for AI Applications"** · Built with **Bifrost (Maxim AI)** and **Tavily**.

**Live demo (zero keys, demo mode): https://freshcheck-rust.vercel.app**

LLM answers go stale silently: last year's price, a deprecated API version, a repealed regulation, a departed CEO — all stated with full confidence. **FreshCheck** breaks an AI-generated answer into atomic claims, finds the ones that can go stale, re-verifies them against the live web, and gives every claim (and the whole answer) a **freshness score** with citations.

## What it does

1. **Claim extraction** — an LLM splits the answer into atomic claims and labels each with a category: `pricing`, `version`, `regulation`, `company`, `date_sensitive`, or `static`.
2. **Staleness triage** — only time-sensitive claims are sent for re-verification; static claims are excluded. Web checks (and cost) stay minimal.
3. **Live re-verification** — each time-sensitive claim is checked against current sources via the **Tavily Search API**. A verifier LLM compares the claim to the evidence and returns `FRESH`, `STALE`, or `UNCERTAIN`, a 0–100 freshness score, a one-line reason, and citations.
4. **Report** — a per-claim traffic-light report plus an overall 0–100 answer freshness score.

## How the partner technologies are used

### Bifrost (Maxim AI)

Every model call in FreshCheck goes through a self-hosted **Bifrost** gateway (OpenAI-compatible, `localhost:8080`):

- **Provider fallback** — primary Groq (free tier) with automatic fallback to Gemini (free tier); verification survives a provider outage.
- **Governance** — Bifrost request logs audit every extraction/verification call (model, tokens, latency, cost); a zero-dollar monthly budget guardrail is included in `bifrost.config.json`.
- **One endpoint** — the app only talks to Bifrost; provider keys live in gateway config, never in app code.

### Tavily

- One `tavily search` per time-sensitive claim fetches current, authoritative sources.
- Results (title, URL, published date, content) are the evidence the verifier judges against — and the citations in the report.

## Architecture

```
User / AI app
     |
     v
+---------------------------------------------+
| FreshCheck (Next.js)                        |
|  answer input -> freshness report UI        |
+---------------------------------------------+
     |                        |
     v                        v
+------------------+   +----------------------+
| Bifrost gateway  |   | Tavily Search API    |
| groq -> gemini   |   | live web evidence    |
| fallback + logs  |   +----------------------+
+------------------+
```

Pipeline: `extract claims (LLM via Bifrost)` → `triage` → `Tavily search per claim` → `verify vs evidence (LLM via Bifrost)` → `score + report`.

## Quick start (demo mode, zero keys)

```bash
npm install
npm run dev          # DEMO_MODE=true by default
# open http://localhost:3000 and press "Check freshness"
```

Demo mode runs the full UI on a canned, deliberately stale answer (a "2024 chat-app advice" snippet whose Next.js version, GPT-4 price, EU AI Act status, and Twitter CEO claims are all outdated) so the entire pipeline shape and report UI work with no API keys.

A CLI version of the same demo: `npm run demo`.

## Live mode

1. **Tavily** — get a free API key at https://app.tavily.com/home and set `TAVILY_API_KEY`.
2. **Bifrost gateway** — run it locally with the included config:
   ```bash
   docker run -p 8080:8080 \
     -e GROQ_API_KEY=... -e GEMINI_API_KEY=... \
     -v $(pwd)/bifrost.config.json:/app/config/config.json \
     maximhq/bifrost
   ```
   Free tiers of Groq and Google Gemini are enough — no paid API anywhere.
3. Set `DEMO_MODE=false`, `BIFROST_URL`, and `BIFROST_MODEL` (see `.env.example`), then `npm run dev`.

## API

`POST /api/verify` — body `{ "answer": "<LLM answer text>" }` → freshness report JSON:

```json
{
  "overallScore": 12,
  "totalClaims": 5,
  "checkedClaims": 4,
  "staleClaims": 4,
  "results": [
    {
      "claim": { "text": "...", "category": "pricing", "timeSensitive": true },
      "verdict": "STALE",
      "score": 15,
      "reason": "OpenAI's current pricing page lists ...",
      "evidence": [{ "title": "...", "url": "...", "publishedDate": "..." }]
    }
  ]
}
```

`GET /api/verify` returns the canned demo answer + report (useful for judges).

## Scoring

- Per claim: `FRESH` ≈ 100, `UNCERTAIN` ≈ 50, `STALE` ≈ 0 (the verifier fine-tunes within the range).
- Overall answer score = mean of time-sensitive claim scores (static claims excluded).

## Tech stack

Next.js 14 (App Router, TypeScript), plain CSS, Bifrost gateway, Tavily Search API, Groq / Gemini free tiers.

## Project layout

```
app/            Next.js app (UI + /api/verify)
lib/            pipeline, LLM-via-Bifrost client, Tavily client, scoring, demo fixtures
bifrost.config.json   gateway config (providers, fallback, governance)
docs/PRODUCT.md       product document
scripts/demo.mjs      zero-key CLI demo
```

## AI usage disclosure

AI tools (LLM coding assistants) were used to help write this code during the hackathon, as permitted by the rules. All LLM calls at runtime route through the Bifrost gateway; all web verification uses the Tavily API.

## License

MIT — see [LICENSE](./LICENSE).
