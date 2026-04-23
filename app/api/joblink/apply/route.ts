import { NextResponse } from "next/server";
import { z } from "zod";
import { applyToJob } from "@/lib/joblink-service";

const applySchema = z.object({
  candidate_id: z.string().min(1),
  job_id: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const data = applySchema.parse(await request.json());
    const application = applyToJob(data.candidate_id, data.job_id);
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
