export type ClaimCategory =
  | "pricing"
  | "version"
  | "regulation"
  | "company"
  | "date_sensitive"
  | "static";

export type Verdict = "FRESH" | "STALE" | "UNCERTAIN" | "STATIC";

export interface Claim {
  id: string;
  text: string;
  category: ClaimCategory;
  timeSensitive: boolean;
}

export interface Evidence {
  title: string;
  url: string;
  publishedDate?: string;
  snippet: string;
}

export interface ClaimResult {
  claim: Claim;
  verdict: Verdict;
  score: number; // 0-100
  reason: string;
  evidence: Evidence[];
}

export interface Report {
  answer: string;
  overallScore: number; // 0-100, time-sensitive claims only
  totalClaims: number;
  checkedClaims: number;
  staleClaims: number;
  uncertainClaims: number;
  results: ClaimResult[];
  mode: "demo" | "live";
  generatedAt: string;
}
