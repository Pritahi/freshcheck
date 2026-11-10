# FreshCheck - Stale-Answer Detector for AI Applications

**Hackathon:** Geek Room Global AI Hackathon 2026 (HackCulture)
**Problem statement:** "Build a Stale-Answer Detector for AI Applications" - detect potentially stale claims in LLM-generated answers (pricing, API versions, regulations, company information), re-verify them against live web sources, and provide a freshness score for each claim. Built with **Bifrost** (Maxim AI) and **Tavily**.

## The problem

LLM answers decay silently. A model trained months ago will happily quote last year's price, a deprecated API version, a repealed regulation, or a departed CEO - with full confidence. Teams shipping AI features have no lightweight way to know *which claims inside an answer are time-sensitive* and *whether they are still true today*.

## The solution

FreshCheck is a verification layer that sits next to any AI application:

1. **Paste or pipe an LLM answer** into FreshCheck (or proxy your app's LLM traffic through it).
2. **Claim extraction** - an LLM breaks the answer into atomic, checkable claims and labels each with a category (pricing, version, regulation, company info, date-sensitive fact, static fact).
3. **Staleness triage** - only claims that *can* go stale are sent for re-verification; static claims are marked out of scope. This keeps web checks (and cost) minimal.
4. **Live re-verification** - each time-sensitive claim is checked against current web sources via the **Tavily Search API**. A verifier LLM compares the claim against the fetched evidence and returns a verdict: `FRESH`, `STALE`, or `UNCERTAIN`, with citations.
5. **Freshness scoring** - every claim gets a 0-100 freshness score; the answer gets an overall score and a traffic-light report (green = verified current, amber = uncertain, red = stale, grey = static).

## Where the partners fit

### Bifrost (Maxim AI) - the LLM gateway

All model traffic in FreshCheck goes through a self-hosted **Bifrost** gateway (`localhost:8080`, OpenAI-compatible):

- **Provider fallback** - primary Groq (free tier), automatic fallback to Gemini (free tier) on errors or rate limits. FreshCheck survives a provider outage mid-verification.
- **Governance** - Bifrost request logs give an auditable trail of every extraction/verification call (which model, tokens, latency, cost).
- **Single endpoint** - the app code talks only to Bifrost; providers and keys live in gateway config, not app code.

### Tavily - live web verification

- One `tavily search` call per time-sensitive claim, scoped to fresh, authoritative sources.
- Search results (title, URL, published date, content snippets) become the evidence the verifier LLM judges against, and the citations shown in the report.

## Architecture

```
User / AI app
     |
     v
+--------------------------------------------------+
| FreshCheck web app (Next.js)                     |
|  - answer input                                  |
|  - freshness report UI (per-claim scores)        |
+--------------------------------------------------+
     |                          |
     v                          v
+------------------+    +-----------------------+
| Bifrost gateway  |    | Tavily Search API     |
| (self-hosted)    |    | (live web evidence)   |
|  groq -> gemini  |    +-----------------------+
|  fallback, logs  |
+------------------+
     |
     v
 Free-tier LLMs (llama-3.3-70b / gemini-flash)
```

Pipeline (per answer):
`extract claims (LLM via Bifrost)` -> `triage time-sensitive vs static (LLM via Bifrost)` -> `Tavily search per claim` -> `verify claim vs evidence (LLM via Bifrost)` -> `score + report`.

## Demo mode

`DEMO_MODE=true` (default) runs the full pipeline on canned fixtures - no API keys needed - so anyone can clone and see the complete report UI in one command. Real mode needs a free Tavily key and one free LLM provider key.

## Scoring

- Claim verdict weights: FRESH = 100, UNCERTAIN = 50, STALE = 0.
- Freshness score per claim decays with evidence age and source authority.
- Overall answer score = weighted mean of time-sensitive claims (static claims excluded), shown as a 0-100 gauge.

## Why this wins

- **Real, common pain** - every team shipping LLM features hits stale-answer bugs; nobody has a cheap checker.
- **Both partners used for what they are good at** - Bifrost for resilient, governed model access; Tavily for the one thing LLMs cannot do: know today.
- **Runs free end-to-end** - free LLM tiers + free Tavily credits.
- **Auditable** - citations for every verdict; gateway logs for every model call.

## Stack

Next.js 14 (App Router, TypeScript), plain CSS, Bifrost gateway (Docker or binary), Tavily Search API, Groq / Google Gemini free tiers. MIT license.
