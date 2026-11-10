# FreshCheck - Demo Video Script (~2 minutes)

Record your screen while running the demo. Read the narration naturally - it does not need to be word-perfect.

## Setup before recording
1. `git clone https://github.com/Pritahi/freshcheck && cd freshcheck`
2. `npm install && npm run dev`
3. Open http://localhost:3000 - the demo answer is pre-loaded.

## Scene 1 - Hook (0:00-0:20)
**Screen:** title slide or the FreshCheck home page.

**Say:** "AI answers go stale silently. Prices change, versions move on, laws come into force - and last year's model keeps answering like nothing happened. FreshCheck catches that. It re-verifies an AI answer against the live web and tells you exactly which claims are stale."

## Scene 2 - The demo (0:20-1:20)
**Screen:** click "Verify answer". Show the report appearing.

**Say:** "Here is a real answer a coding assistant gave in 2024. FreshCheck splits it into atomic claims, triages out the ones that cannot go stale, and checks the rest against today's web. Four out of five claims are stale: Next.js 13 is no longer the latest, GPT-4 pricing has changed, the EU AI Act is in force since August 2024, and Twitter is now X. The overall freshness score is 12 out of 100 - and every verdict has citations with sources and dates."

## Scene 3 - How it works (1:20-1:50)
**Screen:** scroll the README architecture section, or show `bifrost.config.json`.

**Say:** "Under the hood, all model calls go through Bifrost, Maxim AI's open-source LLM gateway. It gives me provider fallback across free tiers, so verification survives an outage, and an audit log of every call. For fresh evidence I use Tavily Search - one search per time-sensitive claim. Static claims are never checked, so the whole thing runs on free tiers."

## Scene 4 - Close (1:50-2:10)
**Screen:** the report page again, or the GitHub repo.

**Say:** "FreshCheck is a Next.js app with a JSON API, it runs end-to-end on free tiers, and the demo you just saw needs zero API keys. The code is on GitHub - link in the submission. Thanks for watching."

## After recording
Upload to YouTube as **Unlisted** titled "FreshCheck - Geek Room Global AI Hackathon 2026" and paste the link into the video field of the submission form. (The video is optional - skip it if short on time.)
