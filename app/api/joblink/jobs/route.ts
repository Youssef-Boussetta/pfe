import { NextResponse } from "next/server";
import { z } from "zod";
import { createJobOffer } from "@/lib/joblink-service";

const jobSchema = z.object({
  company_id: z.string().min(1),
  title: z.string().min(1),
  department: z.string().min(1),
  hard_skills: z.array(z.string()),
  diplomas: z.array(z.string()),
  soft_skills: z.array(z.string()),
  certifications: z.array(z.string()),
  languages: z.array(z.string()),
  address: z.string().min(1),
  postal_code: z.string().min(1),
  positions_count: z.number().int().positive(),
  apply_deadline: z.string().min(1),
  interview_deadline: z.string().min(1),
  description: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const data = jobSchema.parse(await request.json());
    const post = createJobOffer(data.company_id, {
      title: data.title,
      department: data.department,
      hard_skills: data.hard_skills,
      diplomas: data.diplomas,
      soft_skills: data.soft_skills,
      certifications: data.certifications,
      languages: data.languages,
      address: data.address,
      postal_code: data.postal_code,
      positions_count: data.positions_count,
      apply_deadline: data.apply_deadline,
      interview_deadline: data.interview_deadline,
      description: data.description,
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
