import { NextResponse } from "next/server";
import { getFeedSnapshot } from "@/lib/recruitment-service";

export async function GET() {
  return NextResponse.json(await getFeedSnapshot());
}
