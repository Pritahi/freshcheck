import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreshCheck - Stale-Answer Detector",
  description:
    "Detect outdated claims in LLM answers and re-verify them against live web sources. Built with Bifrost and Tavily.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
