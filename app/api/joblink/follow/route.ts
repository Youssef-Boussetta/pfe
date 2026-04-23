import { NextResponse } from "next/server";
import { z } from "zod";
import { followCompany } from "@/lib/joblink-service";
import type { AccountRole } from "@/lib/types";

const followSchema = z.object({
  follower_id: z.string().min(1),
  follower_role: z.enum(["candidate", "company"]),
  target_company_id: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const data = followSchema.parse(await request.json());
    const row = followCompany(data.follower_id, data.follower_role as AccountRole, data.target_company_id);
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
