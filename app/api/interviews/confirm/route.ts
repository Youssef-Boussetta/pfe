import { NextResponse } from "next/server";
import { confirmInterview } from "@/lib/recruitment-service";
import { interviewConfirmSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const data = interviewConfirmSchema.parse(await request.json());
    const interview = await confirmInterview(data.interviewId, data.selectedSlot);
    return NextResponse.json(interview);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: detail }, { status: 400 });
  }
}
