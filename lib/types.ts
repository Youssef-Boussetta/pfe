export type CompanyType = "startup" | "PME" | "multinationale" | "ONG";
export type Decision = "accepted" | "rejected" | "pending";
export type MessageType = "acceptance" | "rejection" | "interview" | "contract" | "system";
export type InterviewStatus = "pending" | "confirmed";

export interface Company {
  id: string;
  name: string;
  commercial_name: string;
  logo_url: string;
  description: string;
  sector: string;
  size: number;
  type: CompanyType;
  created_at: string;
  website: string;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  phone: string;
  email: string;
  timezone: string;
  registration_number: string;
  tax_id: string;
  vat_number: string;
  legal_form: string;
  legal_representative: string;
  registration_country: string;
  hr_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
  };
  departments: string[];
  contract_types: string[];
  recruitment_language: string;
  recruitment_policy: string;
}

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  nationality: string;
  profile_photo: string;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  auth_provider: "email" | "google" | "linkedin";
  created_at: string;
  cv: {
    bio: string;
    education: {
      start_date: string;
      end_date: string;
      institution: string;
      degree: string;
    }[];
    experience: {
      start_date: string;
      end_date: string;
      company: string;
      position: string;
      department: string;
      contract_type: string;
    }[];
    hard_skills: string[];
    soft_skills: string[];
    languages: {
      language: string;
      level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
    }[];
    certifications: {
      name: string;
      degree: string;
    }[];
  };
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  department: string;
  hard_skills: string[];
  soft_skills: string[];
  diplomas: string[];
  certifications: string[];
  languages: string[];
  address: string;
  postal_code: string;
  positions_count: number;
  apply_deadline: string;
  interview_deadline: string;
  description: string;
  created_at: string;
}

export interface Application {
  id: string;
  candidate_id: string;
  job_id: string;
  score: number;
  decision: Decision;
  created_at: string;
}

export interface InternalMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  type: MessageType;
  content: string;
  metadata?: {
    job_id?: string;
    company_id?: string;
    pdf_url?: string;
    action?: string;
  };
  read: boolean;
  created_at: string;
}

export interface Interview {
  id: string;
  candidate_id: string;
  job_id: string;
  company_id: string;
  available_slots: { date: string; time: string }[];
  selected_slot?: { date: string; time: string };
  status: InterviewStatus;
  created_at: string;
}

export interface ContractDoc {
  id: string;
  candidate_id: string;
  job_id: string;
  company_id: string;
  contract_type: string;
  salary: number;
  start_date: string;
  pdf_url: string;
  created_at: string;
}

export interface FeedPayload {
  companies: Company[];
  candidates: Candidate[];
  jobs: Job[];
  applications: Application[];
  messages: InternalMessage[];
  interviews: Interview[];
  contracts: ContractDoc[];
}

export type AccountRole = "candidate" | "company";

export interface CandidateEducationItem {
  start_month: string;
  end_month: string;
  institution: string;
  degree: string;
}

export interface CandidateExperienceItem {
  start_month: string;
  end_month: string;
  company: string;
  position: string;
  department: string;
  contract_type: string;
}

export interface CandidateLanguageItem {
  language: string;
  level: string;
}

export interface CandidateCertificationItem {
  name: string;
  degree?: string;
}

export interface CandidateCvDocument {
  bio: string;
  education: CandidateEducationItem[];
  experience: CandidateExperienceItem[];
  hard_skills: string[];
  soft_skills: string[];
  languages: CandidateLanguageItem[];
  certifications: CandidateCertificationItem[];
  shared_at?: string;
}

export interface JobLinkUserSession {
  user_id: string;
  role: AccountRole;
  email: string;
  display_name: string;
}

export interface JobOfferPost {
  id: string;
  company_id: string;
  title: string;
  department: string;
  hard_skills: string[];
  diplomas: string[];
  soft_skills: string[];
  certifications: string[];
  languages: string[];
  address: string;
  postal_code: string;
  positions_count: number;
  apply_deadline: string;
  interview_deadline: string;
  description: string;
  created_at: string;
  auto_processed?: boolean;
}

export interface FollowLink {
  id: string;
  follower_id: string;
  follower_role: AccountRole;
  target_company_id: string;
  created_at: string;
}
