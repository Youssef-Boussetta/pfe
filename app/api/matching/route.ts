import { NextResponse } from "next/server";
import { runMatching } from "@/lib/recruitment-service";
import { scoreRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const data = scoreRequestSchema.parse(await request.json());
    const result = await runMatching(data.candidateId, data.jobId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
