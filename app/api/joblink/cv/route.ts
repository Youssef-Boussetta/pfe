import { NextResponse } from "next/server";
import { z } from "zod";
import { saveCandidateCv } from "@/lib/joblink-service";

const cvSchema = z.object({
  candidate_id: z.string().min(1),
  bio: z.string().min(1),
  education: z.array(
    z.object({
      start_month: z.string().min(1),
      end_month: z.string().min(1),
      institution: z.string().min(1),
      degree: z.string().min(1),
    }),
  ),
  experience: z.array(
    z.object({
      start_month: z.string().min(1),
      end_month: z.string().min(1),
      company: z.string().min(1),
      position: z.string().min(1),
      department: z.string().min(1),
      contract_type: z.string().min(1),
    }),
  ),
  hard_skills: z.array(z.string()),
  soft_skills: z.array(z.string()),
  languages: z.array(z.object({ language: z.string().min(1), level: z.string().min(1) })),
  certifications: z.array(z.object({ name: z.string().min(1), degree: z.string().optional() })),
});

export async function POST(request: Request) {
  try {
    const data = cvSchema.parse(await request.json());
    saveCandidateCv(data.candidate_id, { ...data, shared_at: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
