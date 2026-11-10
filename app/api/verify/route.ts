import { NextRequest, NextResponse } from "next/server";
import { verifyAnswer } from "@/lib/pipeline";
import { demoReport, DEMO_ANSWER } from "@/lib/report";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const demoMode = (process.env.DEMO_MODE ?? "true") !== "false";
  try {
    const body = await req.json().catch(() => ({}));
    const answer: string = (body.answer ?? "").toString().slice(0, 8000);

    if (demoMode) {
      // Demo mode always renders the canned report so the UI works with zero keys.
      return NextResponse.json(demoReport());
    }
    if (!answer.trim()) {
      return NextResponse.json({ error: "answer is required" }, { status: 400 });
    }
    const report = await verifyAnswer(answer);
    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  // Handy for judges: shows the demo answer + report without any keys.
  return NextResponse.json({ demoAnswer: DEMO_ANSWER, report: demoReport() });
}
