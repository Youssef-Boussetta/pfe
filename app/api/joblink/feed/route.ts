import { NextResponse } from "next/server";
import { z } from "zod";
import { getFeedForUser } from "@/lib/joblink-service";
import type { AccountRole } from "@/lib/types";

const querySchema = z.object({
  user_id: z.string().min(1),
  role: z.enum(["candidate", "company"]),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = querySchema.parse({
      user_id: url.searchParams.get("user_id"),
      role: url.searchParams.get("role"),
    });
    const feed = getFeedForUser(params.user_id, params.role as AccountRole);
    return NextResponse.json(feed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
