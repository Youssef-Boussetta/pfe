import { NextResponse } from "next/server";
import { searchAccounts } from "@/lib/joblink-service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  return NextResponse.json(searchAccounts(q));
}
