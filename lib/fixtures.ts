import type { Claim, Evidence, Verdict } from "./types";

export const DEMO_CLAIMS: Claim[] = [
  {
    id: "c1",
    text: "Next.js 13 with the pages router is the latest stable version.",
    category: "version",
    timeSensitive: true,
  },
  {
    id: "c2",
    text: "OpenAI's GPT-4 API costs $0.03 per 1K input tokens.",
    category: "pricing",
    timeSensitive: true,
  },
  {
    id: "c3",
    text: "The EU AI Act is still under negotiation, so no compliance is needed yet.",
    category: "regulation",
    timeSensitive: true,
  },
  {
    id: "c4",
    text: "Elon Musk is the CEO of Twitter.",
    category: "company",
    timeSensitive: true,
  },
  {
    id: "c5",
    text: "Storing user sessions in localStorage is considered secure best practice.",
    category: "static",
    timeSensitive: false,
  },
];

export const DEMO_VERDICTS: Record<number, { verdict: Verdict; score: number; reason: string }> = {
  0: {
    verdict: "STALE",
    score: 8,
    reason:
      "Next.js 15 is the current stable release (Next.js 13 shipped in Oct 2022), and the App Router has been the recommended default since Next.js 13.4.",
  },
  1: {
    verdict: "STALE",
    score: 15,
    reason:
      "OpenAI's current pricing page lists different rates; GPT-4 pricing has changed several times and newer models (GPT-4o, GPT-4.1) cost less per 1K input tokens.",
  },
  2: {
    verdict: "STALE",
    score: 5,
    reason:
      "The EU AI Act entered into force on 1 August 2024, with obligations phasing in from February 2025. It is no longer under negotiation.",
  },
  3: {
    verdict: "STALE",
    score: 20,
    reason:
      "Twitter was rebranded to X in 2023. Elon Musk owns X but Linda Yaccarino served as CEO from 2023 to 2025; the title 'CEO of Twitter' is outdated.",
  },
  4: { verdict: "STATIC", score: 100, reason: "" },
};

export const DEMO_EVIDENCE: Record<string, Evidence[]> = {
  c1: [
    {
      title: "Next.js 15 - Next.js",
      url: "https://nextjs.org/blog/next-15",
      publishedDate: "2024-10-21",
      snippet: "We are excited to announce Next.js 15, now stable and ready for production.",
    },
    {
      title: "Getting Started: App Router - Next.js",
      url: "https://nextjs.org/docs/app",
      snippet: "The App Router is the recommended router for all new Next.js applications.",
    },
  ],
  c2: [
    {
      title: "OpenAI API Pricing",
      url: "https://openai.com/api/pricing/",
      snippet: "GPT-4o: $2.50 / 1M input tokens. GPT-4.1 mini: $0.40 / 1M input tokens.",
    },
  ],
  c3: [
    {
      title: "AI Act | Shaping Europe's digital future",
      url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
      publishedDate: "2024-08-01",
      snippet:
        "The AI Act entered into force on 1 August 2024. Prohibitions and AI literacy obligations apply from 2 February 2025.",
    },
  ],
  c4: [
    {
      title: "X (formerly Twitter) - Reuters",
      url: "https://www.reuters.com/technology/x-corp/",
      snippet:
        "Twitter rebranded as X in July 2023. Linda Yaccarino was appointed CEO in June 2023 and stepped down in 2025.",
    },
  ],
};
