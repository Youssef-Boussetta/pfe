import { NextResponse } from "next/server";
import { runDecision } from "@/lib/recruitment-service";
import { decisionRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const data = decisionRequestSchema.parse(await request.json());
    const result = await runDecision(data.jobId, data.topN);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
