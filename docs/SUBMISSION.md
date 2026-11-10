# FreshCheck - Submission Texts (paste-ready)

Track: **Build a Stale-Answer Detector for AI Applications** (uses both partner technologies: Bifrost by Maxim AI + Tavily)

## Project name
FreshCheck

## Tagline (one line)
A stale-answer detector for AI applications: it re-verifies LLM answers against the live web and scores how fresh they still are.

## Short description (~100 words)
LLM answers go stale silently: prices change, versions move on, laws enter into force, companies get renamed. FreshCheck finds the claims in an AI answer that can go stale, re-verifies each one against current web sources, and scores the answer's freshness from 0 to 100 with citations. It uses Bifrost (Maxim AI) as the LLM gateway for claim extraction and verification, with provider fallback across free tiers and per-request audit logs, and Tavily Search to fetch fresh, authoritative sources for every time-sensitive claim. Static claims are triaged out, so checks stay cheap. Ships as a Next.js app with a JSON API and a zero-key demo mode.

## Long description / problem + solution
**Problem.** Every team shipping AI features hits stale-answer bugs. An LLM trained months ago will confidently quote last year's prices, call an old framework version "the latest", describe a regulation as "still under negotiation" when it is already in force, or use a company's old name. Today there is no cheap, automated way to catch this before users do.

**Solution.** FreshCheck is a verification layer for AI answers:
1. **Extract** - an LLM (via the Bifrost gateway) splits the answer into atomic claims, labelled by type (pricing, version, regulation, company, date-sensitive, static).
2. **Triage** - only claims that can go stale are checked. Static claims are excluded, so web checks and cost stay minimal.
3. **Verify** - each time-sensitive claim is checked against current sources fetched with Tavily Search. A verifier LLM (again via Bifrost) judges the claim against the evidence.
4. **Score** - every claim gets FRESH / STALE / UNCERTAIN with a 0-100 freshness score, citations with source URLs and published dates, and the answer gets an overall score.

**Use of partner technologies.**
- **Bifrost (Maxim AI)** is the single gateway for all LLM calls (extraction + verification). It provides provider fallback (Groq -> Gemini free tiers), so verification survives a provider outage, and governance: request logs audit every model call (model, tokens, latency, cost). Provider keys live in the gateway config, never in app code.
- **Tavily** does the one thing an LLM cannot do: know today. One search per time-sensitive claim fetches current, authoritative sources; results become both the evidence the verifier judges against and the citations users see.

**Demo.** `npm install && npm run dev` runs a full pipeline demo on a deliberately stale 2024 answer - zero API keys needed. Live mode needs only free-tier keys (Bifrost gateway via Docker + Groq/Gemini + a free Tavily key).

## Tech stack
Next.js 14, TypeScript, Bifrost (Maxim AI) LLM gateway, Tavily Search API, Groq + Gemini free tiers, Docker (gateway), MIT license.

**Live demo:** https://freshcheck-rust.vercel.app (deployed in demo mode - judges can click through the full pipeline with zero API keys)

## Links
- Live demo: https://freshcheck-rust.vercel.app
- Repo: https://github.com/Pritahi/freshcheck
- Pitch deck: docs/freshcheck-deck.pptx (in repo)
- Video script: docs/VIDEO-SCRIPT.md (video is optional per the hackathon FAQ)
