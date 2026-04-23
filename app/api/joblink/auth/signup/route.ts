import { NextResponse } from "next/server";
import { z } from "zod";
import { registerCandidate, registerCompany } from "@/lib/joblink-service";

const candidateSignupSchema = z.object({
  role: z.literal("candidate"),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  birth_date: z.string().min(1),
  nationality: z.string().min(1),
  profile_photo: z.string().optional(),
  country: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  postal_code: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  password: z.string().min(6),
});

const companySignupSchema = z.object({
  role: z.literal("company"),
  company_name: z.string().min(1),
  commercial_name: z.string().min(1),
  logo_url: z.string().optional(),
  description: z.string().min(1),
  sector: z.string().min(1),
  size: z.number().int().positive(),
  type: z.string().min(1),
  created_date: z.string().min(1),
  website: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  postal_code: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  timezone: z.string().min(1),
  registration_number: z.string().min(1),
  tax_id: z.string().min(1),
  vat_number: z.string().min(1),
  legal_form: z.string().min(1),
  legal_representative: z.string().min(1),
  registration_country: z.string().min(1),
  hr_first_name: z.string().min(1),
  hr_last_name: z.string().min(1),
  hr_email: z.string().email(),
  hr_phone: z.string().min(1),
  hr_role: z.string().min(1),
  departments: z.array(z.string()).min(1),
  contract_types: z.array(z.string()).min(1),
  recruitment_language: z.string().min(1),
  recruitment_policy: z.string().optional(),
  password: z.string().min(6),
});

const signupSchema = z.union([candidateSignupSchema, companySignupSchema]);

export async function POST(request: Request) {
  try {
    const data = signupSchema.parse(await request.json());
    const session = data.role === "candidate" ? registerCandidate(data) : registerCompany(data);
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
