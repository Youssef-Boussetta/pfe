import { NextResponse } from "next/server";
import { sendInternalMessage } from "@/lib/recruitment-service";
import { messageRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const data = messageRequestSchema.parse(await request.json());
    const message = await sendInternalMessage(data);
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: detail }, { status: 400 });
  }
}
