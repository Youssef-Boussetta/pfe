import type { Candidate, Company } from "@/lib/types";

export function CandidateHomeList({ companies }: { companies: Company[] }) {
  return (
    <div className="space-y-3">
      {companies.map((company) => (
        <article key={company.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900">{company.commercial_name || company.name}</h3>
          <p className="mt-1 text-sm text-zinc-600">{company.description}</p>
          <p className="mt-2 text-xs text-zinc-500">
            {company.city}, {company.country} - {company.sector}
          </p>
        </article>
      ))}
    </div>
  );
}

export function CompanyHomeList({ candidates }: { candidates: Candidate[] }) {
  return (
    <div className="space-y-3">
      {candidates.map((candidate) => (
        <article key={candidate.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900">
            {candidate.first_name} {candidate.last_name}
          </h3>
          <p className="mt-1 text-sm text-zinc-600">{candidate.cv.bio}</p>
          <p className="mt-2 text-xs text-zinc-500">{candidate.cv.hard_skills.slice(0, 5).join(" - ")}</p>
        </article>
      ))}
    </div>
  );
}
