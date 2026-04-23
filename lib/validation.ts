import { z } from "zod";

export const companySchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  commercial_name: z.string(),
  logo_url: z.string().url().or(z.literal("")),
  description: z.string(),
  sector: z.string(),
  size: z.number().int().nonnegative(),
  type: z.enum(["startup", "PME", "multinationale", "ONG"]),
  created_at: z.string(),
  website: z.string().url().or(z.literal("")),
  country: z.string(),
  city: z.string(),
  address: z.string(),
  postal_code: z.string(),
  phone: z.string(),
  email: z.string().email(),
  timezone: z.string(),
  registration_number: z.string(),
  tax_id: z.string(),
  vat_number: z.string(),
  legal_form: z.string(),
  legal_representative: z.string(),
  registration_country: z.string(),
  hr_info: z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    role: z.string(),
  }),
  departments: z.array(z.string()),
  contract_types: z.array(z.string()),
  recruitment_language: z.string(),
  recruitment_policy: z.string(),
});

export const candidateSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  cv: z.object({
    bio: z.string(),
    hard_skills: z.array(z.string()),
    soft_skills: z.array(z.string()),
    certifications: z.array(
      z.object({
        name: z.string(),
        degree: z.string(),
      }),
    ),
    education: z.array(
      z.object({
        degree: z.string(),
      }),
    ),
    languages: z.array(
      z.object({
        language: z.string(),
        level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
      }),
    ),
  }),
});

export const jobSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  title: z.string(),
  department: z.string(),
  hard_skills: z.array(z.string()),
  soft_skills: z.array(z.string()),
  diplomas: z.array(z.string()),
  certifications: z.array(z.string()),
  languages: z.array(z.string()),
  positions_count: z.number().int().positive(),
  apply_deadline: z.string(),
  interview_deadline: z.string(),
  description: z.string(),
  created_at: z.string(),
});

export const scoreRequestSchema = z.object({
  candidateId: z.string(),
  jobId: z.string(),
});

export const decisionRequestSchema = z.object({
  jobId: z.string(),
  topN: z.number().int().positive().default(3),
});

export const messageRequestSchema = z.object({
  sender_id: z.string(),
  receiver_id: z.string(),
  type: z.enum(["acceptance", "rejection", "interview", "contract", "system"]),
  content: z.string().min(1),
  metadata: z
    .object({
      job_id: z.string().optional(),
      company_id: z.string().optional(),
      pdf_url: z.string().optional(),
      action: z.string().optional(),
    })
    .optional(),
});

export const interviewConfirmSchema = z.object({
  interviewId: z.string(),
  selectedSlot: z.object({
    date: z.string(),
    time: z.string(),
  }),
});

export const contractCreateSchema = z.object({
  candidate_id: z.string(),
  job_id: z.string(),
  company_id: z.string(),
  contract_type: z.string(),
  salary: z.number().positive(),
  start_date: z.string(),
});
