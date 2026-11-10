// Zero-key CLI demo: prints the canned demo report (mirrors lib/fixtures.ts).
// node scripts/demo.mjs
const report = {
  overallScore: 12,
  results: [
    {
      verdict: "STALE",
      score: 8,
      text: "Next.js 13 with the pages router is the latest stable version.",
      reason: "Next.js 15 is the current stable release (Next.js 13 shipped in Oct 2022), and the App Router has been the recommended default since Next.js 13.4.",
      src: "https://nextjs.org/blog/next-15",
    },
    {
      verdict: "STALE",
      score: 15,
      text: "OpenAI's GPT-4 API costs $0.03 per 1K input tokens.",
      reason: "OpenAI's current pricing page lists different rates; newer models (GPT-4o, GPT-4.1) cost less per 1K input tokens.",
      src: "https://openai.com/api/pricing/",
    },
    {
      verdict: "STALE",
      score: 5,
      text: "The EU AI Act is still under negotiation, so no compliance is needed yet.",
      reason: "The EU AI Act entered into force on 1 August 2024, with obligations phasing in from February 2025.",
      src: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
    },
    {
      verdict: "STALE",
      score: 20,
      text: "Elon Musk is the CEO of Twitter.",
      reason: "Twitter rebranded as X in 2023; the title 'CEO of Twitter' is outdated.",
      src: "https://www.reuters.com/technology/x-corp/",
    },
    {
      verdict: "STATIC",
      score: 100,
      text: "Storing user sessions in localStorage is considered secure best practice.",
      reason: "General engineering opinion, not a time-sensitive fact. Not checked against the web.",
      src: null,
    },
  ],
};

console.log(`Answer freshness: ${report.overallScore}/100\n`);
for (const r of report.results) {
  console.log(`[${r.verdict}] (${r.score}/100) ${r.text}`);
  console.log(`   -> ${r.reason}`);
  if (r.src) console.log(`   src: ${r.src}`);
}
