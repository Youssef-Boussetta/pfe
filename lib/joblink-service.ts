import { mockCandidates, mockCompanies } from "@/lib/mock-data";
import { scoreCandidateForJob } from "@/lib/matching";
import type {
  AccountRole,
  Application,
  Candidate,
  CandidateCvDocument,
  Company,
  FollowLink,
  InternalMessage,
  JobLinkUserSession,
  JobOfferPost,
} from "@/lib/types";

const candidatesDb: Candidate[] = [...mockCandidates];
const companiesDb: Company[] = [...mockCompanies];
const jobPostsDb: JobOfferPost[] = [];
const applicationsDb: Application[] = [];
const followsDb: FollowLink[] = [];
const messagesDb: InternalMessage[] = [];
const cvsDb = new Map<string, CandidateCvDocument>();
const sessions = new Map<string, { id: string; email: string; password: string; role: AccountRole }>();

const nowIso = () => new Date().toISOString();

function generateId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function registerCompany(input: {
  company_name: string;
  commercial_name: string;
  logo_url?: string;
  description: string;
  sector: string;
  size: number;
  type: string;
  created_date: string;
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
  hr_first_name: string;
  hr_last_name: string;
  hr_email: string;
  hr_phone: string;
  hr_role: string;
  departments: string[];
  contract_types: string[];
  recruitment_language: string;
  recruitment_policy?: string;
  password: string;
}) {
  const existing = sessions.get(input.email.toLowerCase());
  if (existing) throw new Error("Email deja utilise.");

  const companyId = generateId("comp");
  const company: Company = {
    id: companyId,
    name: input.company_name,
    commercial_name: input.commercial_name || input.company_name,
    logo_url: input.logo_url || "",
    description: input.description,
    sector: input.sector,
    size: Number(input.size),
    type: (input.type as Company["type"]) || "PME",
    created_at: input.created_date || nowIso(),
    website: input.website,
    country: input.country,
    city: input.city,
    address: input.address,
    postal_code: input.postal_code,
    phone: input.phone,
    email: input.email,
    timezone: input.timezone,
    registration_number: input.registration_number,
    tax_id: input.tax_id,
    vat_number: input.vat_number,
    legal_form: input.legal_form,
    legal_representative: input.legal_representative,
    registration_country: input.registration_country,
    hr_info: {
      first_name: input.hr_first_name,
      last_name: input.hr_last_name,
      email: input.hr_email,
      phone: input.hr_phone,
      role: input.hr_role,
    },
    departments: input.departments,
    contract_types: input.contract_types,
    recruitment_language: input.recruitment_language,
    recruitment_policy: input.recruitment_policy || "",
  };

  companiesDb.unshift(company);
  sessions.set(input.email.toLowerCase(), { id: companyId, email: input.email, password: input.password, role: "company" });

  const user: JobLinkUserSession = {
    user_id: companyId,
    role: "company",
    email: input.email,
    display_name: company.commercial_name,
  };
  return user;
}

export function registerCandidate(input: {
  first_name: string;
  last_name: string;
  birth_date: string;
  nationality: string;
  profile_photo?: string;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  password: string;
}) {
  const existing = sessions.get(input.email.toLowerCase());
  if (existing) throw new Error("Email deja utilise.");

  const candidateId = generateId("cand");
  const candidate: Candidate = {
    id: candidateId,
    first_name: input.first_name,
    last_name: input.last_name,
    birth_date: input.birth_date,
    nationality: input.nationality,
    profile_photo: input.profile_photo || "",
    country: input.country,
    city: input.city,
    address: input.address,
    postal_code: input.postal_code,
    email: input.email,
    phone: input.phone,
    linkedin: input.linkedin || "",
    github: input.github || "",
    auth_provider: "email",
    created_at: nowIso(),
    cv: {
      bio: "",
      education: [],
      experience: [],
      hard_skills: [],
      soft_skills: [],
      languages: [],
      certifications: [],
    },
  };

  candidatesDb.unshift(candidate);
  sessions.set(input.email.toLowerCase(), { id: candidateId, email: input.email, password: input.password, role: "candidate" });

  const user: JobLinkUserSession = {
    user_id: candidateId,
    role: "candidate",
    email: input.email,
    display_name: `${candidate.first_name} ${candidate.last_name}`,
  };
  return user;
}

export function loginWithCredentials(email: string, password: string): JobLinkUserSession {
  const account = sessions.get(email.toLowerCase());
  if (!account || account.password !== password) {
    throw new Error("Coordonnees invalides.");
  }
  if (account.role === "candidate") {
    const candidate = candidatesDb.find((item) => item.id === account.id);
    if (!candidate) throw new Error("Compte introuvable.");
    return {
      user_id: candidate.id,
      role: "candidate",
      email: candidate.email,
      display_name: `${candidate.first_name} ${candidate.last_name}`,
    };
  }
  const company = companiesDb.find((item) => item.id === account.id);
  if (!company) throw new Error("Compte introuvable.");
  return {
    user_id: company.id,
    role: "company",
    email: company.email,
    display_name: company.commercial_name,
  };
}

export function saveCandidateCv(candidateId: string, cv: CandidateCvDocument) {
  const candidate = candidatesDb.find((item) => item.id === candidateId);
  if (!candidate) throw new Error("Candidat introuvable.");
  cvsDb.set(candidateId, cv);
  candidate.cv = {
    bio: cv.bio,
    education: cv.education.map((item) => ({
      start_date: item.start_month,
      end_date: item.end_month,
      institution: item.institution,
      degree: item.degree,
    })),
    experience: cv.experience.map((item) => ({
      start_date: item.start_month,
      end_date: item.end_month,
      company: item.company,
      position: item.position,
      department: item.department,
      contract_type: item.contract_type,
    })),
    hard_skills: cv.hard_skills,
    soft_skills: cv.soft_skills,
    languages: cv.languages.map((item) => ({ language: item.language, level: item.level as Candidate["cv"]["languages"][number]["level"] })),
    certifications: cv.certifications.map((item) => ({ name: item.name, degree: item.degree || "" })),
  };
}

export function createJobOffer(companyId: string, job: Omit<JobOfferPost, "id" | "created_at" | "company_id" | "auto_processed">) {
  const post: JobOfferPost = {
    ...job,
    id: generateId("job"),
    company_id: companyId,
    created_at: nowIso(),
    auto_processed: false,
  };
  jobPostsDb.unshift(post);
  return post;
}

export function applyToJob(candidateId: string, jobId: string) {
  const job = jobPostsDb.find((item) => item.id === jobId);
  if (!job) throw new Error("Offre introuvable.");
  if (new Date(job.apply_deadline).getTime() < Date.now()) {
    throw new Error("Date limite de candidature depassee.");
  }
  const already = applicationsDb.find((item) => item.candidate_id === candidateId && item.job_id === jobId);
  if (already) return already;
  const app: Application = {
    id: generateId("app"),
    candidate_id: candidateId,
    job_id: jobId,
    score: 0,
    decision: "pending",
    created_at: nowIso(),
  };
  applicationsDb.unshift(app);
  return app;
}

export function followCompany(followerId: string, followerRole: AccountRole, targetCompanyId: string) {
  if (followerRole === "candidate" || followerRole === "company") {
    const exists = followsDb.find((item) => item.follower_id === followerId && item.target_company_id === targetCompanyId);
    if (exists) return exists;
    const row: FollowLink = {
      id: generateId("follow"),
      follower_id: followerId,
      follower_role: followerRole,
      target_company_id: targetCompanyId,
      created_at: nowIso(),
    };
    followsDb.unshift(row);
    return row;
  }
  throw new Error("Role invalide.");
}

function scoreForJob(candidate: Candidate, job: JobOfferPost) {
  return scoreCandidateForJob(candidate, {
    id: job.id,
    company_id: job.company_id,
    title: job.title,
    department: job.department,
    hard_skills: job.hard_skills,
    soft_skills: job.soft_skills,
    diplomas: job.diplomas,
    certifications: job.certifications,
    languages: job.languages,
    address: job.address,
    postal_code: job.postal_code,
    positions_count: job.positions_count,
    apply_deadline: job.apply_deadline,
    interview_deadline: job.interview_deadline,
    description: job.description,
    created_at: job.created_at,
  });
}

export function processExpiredJobs() {
  for (const job of jobPostsDb) {
    if (job.auto_processed) continue;
    if (new Date(job.apply_deadline).getTime() > Date.now()) continue;

    const jobApps = applicationsDb.filter((item) => item.job_id === job.id);
    for (const app of jobApps) {
      const candidate = candidatesDb.find((item) => item.id === app.candidate_id);
      if (!candidate) continue;
      app.score = scoreForJob(candidate, job);
    }
    const sorted = [...jobApps].sort((a, b) => b.score - a.score);
    const acceptedSet = new Set(sorted.slice(0, job.positions_count).map((item) => item.id));
    for (const app of sorted) {
      app.decision = acceptedSet.has(app.id) ? "accepted" : "rejected";
      messagesDb.unshift({
        id: generateId("msg"),
        sender_id: job.company_id,
        receiver_id: app.candidate_id,
        type: app.decision === "accepted" ? "acceptance" : "rejection",
        content:
          app.decision === "accepted"
            ? "Felicitations, votre candidature est acceptee."
            : "Merci pour votre candidature. Malheureusement, votre profil n'a pas ete retenu.",
        metadata: { job_id: job.id, company_id: job.company_id },
        read: false,
        created_at: nowIso(),
      });
    }
    job.auto_processed = true;
  }
}

export function getFeedForUser(userId: string, role: AccountRole) {
  processExpiredJobs();
  const follows = followsDb.filter((item) => item.follower_id === userId).map((item) => item.target_company_id);
  const companies = [...companiesDb];
  const candidates = [...candidatesDb].sort((a, b) => b.created_at.localeCompare(a.created_at));

  if (role === "candidate") {
    const me = candidatesDb.find((item) => item.id === userId);
    const jobs = [...jobPostsDb]
      .map((job) => {
        const score = me ? scoreForJob(me, job) : 0;
        const followBoost = follows.includes(job.company_id) ? 1000 : 0;
        return { ...job, _score: score + followBoost };
      })
      .sort((a, b) => b._score - a._score);
    return {
      jobs,
      candidates: [],
      companies,
      applications: applicationsDb.filter((item) => item.candidate_id === userId),
      messages: messagesDb.filter((item) => item.receiver_id === userId),
    };
  }

  const jobs = [...jobPostsDb].sort((a, b) => b.created_at.localeCompare(a.created_at));
  return {
    jobs,
    candidates,
    companies,
    applications: applicationsDb.filter((item) => jobs.some((job) => job.company_id === userId && job.id === item.job_id)),
    messages: messagesDb.filter((item) => item.receiver_id === userId),
  };
}

export function searchAccounts(queryValue: string) {
  const query = queryValue.toLowerCase().trim();
  const companies = companiesDb.filter(
    (item) => item.name.toLowerCase().includes(query) || item.commercial_name.toLowerCase().includes(query),
  );
  const candidates = candidatesDb.filter(
    (item) => `${item.first_name} ${item.last_name}`.toLowerCase().includes(query),
  );
  return { companies, candidates };
}

export function getCompanyDashboard(companyId: string) {
  processExpiredJobs();
  const jobs = jobPostsDb.filter((item) => item.company_id === companyId);
  const rows = applicationsDb
    .filter((item) => jobs.some((job) => job.id === item.job_id))
    .map((app) => {
      const candidate = candidatesDb.find((item) => item.id === app.candidate_id);
      const job = jobs.find((item) => item.id === app.job_id);
      return {
        application: app,
        candidate,
        cv: candidate ? cvsDb.get(candidate.id) ?? null : null,
        job,
      };
    });
  return rows;
}
