"use client";

import { useEffect, useState } from "react";
import type { CandidateCvDocument, JobLinkUserSession, JobOfferPost } from "@/lib/types";

type FeedResponse = {
  jobs: Array<JobOfferPost & { _score?: number }>;
  candidates: Array<{ id: string; first_name: string; last_name: string; cv: { bio: string; hard_skills: string[] } }>;
  companies: Array<{ id: string; commercial_name: string; description: string; sector: string; city: string }>;
  applications: Array<{ id: string; job_id: string; candidate_id: string; decision: string; score: number }>;
  messages: Array<{ id: string; type: string; content: string; created_at: string }>;
};

function parseSession(): JobLinkUserSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("joblink_session");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as JobLinkUserSession;
  } catch {
    return null;
  }
}

const emptyCvItem = () => ({ start_month: "", end_month: "", institution: "", degree: "" });
const emptyExpItem = () => ({ start_month: "", end_month: "", company: "", position: "", department: "", contract_type: "" });
const emptyLangItem = () => ({ language: "", level: "" });
const emptyCertItem = () => ({ name: "", degree: "" });

export function JobLinkFeed() {
  const [session] = useState<JobLinkUserSession | null>(() => parseSession());
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ companies: { id: string; commercial_name: string }[]; candidates: { id: string; first_name: string; last_name: string }[] } | null>(null);
  const [activeTab, setActiveTab] = useState<"feed" | "account" | "dashboard">("feed");
  const [dashboardRows, setDashboardRows] = useState<
    Array<{
      application: { id: string; candidate_id: string; job_id: string; score: number; decision: string };
      candidate: { first_name: string; last_name: string; email: string; phone: string } | null;
      cv: { bio: string; hard_skills: string[] } | null;
      job: { title: string } | null;
    }>
  >([]);

  const [cvForm, setCvForm] = useState<CandidateCvDocument>({
    bio: "",
    education: [emptyCvItem()],
    experience: [emptyExpItem()],
    hard_skills: [],
    soft_skills: [],
    languages: [emptyLangItem()],
    certifications: [emptyCertItem()],
  });

  const [jobForm, setJobForm] = useState({
    title: "",
    department: "",
    hard_skills: [""],
    diplomas: [""],
    soft_skills: [""],
    certifications: [""],
    languages: [""],
    address: "",
    postal_code: "",
    positions_count: 1,
    apply_deadline: "",
    interview_deadline: "",
    description: "",
  });

  async function refreshFeed(currentSession: JobLinkUserSession) {
    const response = await fetch(`/api/joblink/feed?user_id=${currentSession.user_id}&role=${currentSession.role}`, {
      cache: "no-store",
    });
    const payload = (await response.json()) as FeedResponse;
    setFeed(payload);
  }

  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(() => {
      void refreshFeed(session);
    }, 0);
    return () => clearTimeout(timer);
  }, [session]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleSearch(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setSearchResults(null);
      return;
    }
    const response = await fetch(`/api/joblink/search?q=${encodeURIComponent(value)}`);
    setSearchResults(await response.json());
  }

  async function saveCv() {
    if (!session) return;
    await fetch("/api/joblink/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cvForm, candidate_id: session.user_id }),
    });
    await refreshFeed(session);
    setActiveTab("feed");
  }

  async function publishJob() {
    if (!session) return;
    await fetch("/api/joblink/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_id: session.user_id,
        ...jobForm,
        hard_skills: jobForm.hard_skills.filter(Boolean),
        diplomas: jobForm.diplomas.filter(Boolean),
        soft_skills: jobForm.soft_skills.filter(Boolean),
        certifications: jobForm.certifications.filter(Boolean),
        languages: jobForm.languages.filter(Boolean),
      }),
    });
    await refreshFeed(session);
    setActiveTab("feed");
  }

  async function apply(jobId: string) {
    if (!session) return;
    await fetch("/api/joblink/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate_id: session.user_id, job_id: jobId }),
    });
    await refreshFeed(session);
  }

  async function follow(companyId: string) {
    if (!session) return;
    await fetch("/api/joblink/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        follower_id: session.user_id,
        follower_role: session.role,
        target_company_id: companyId,
      }),
    });
    await refreshFeed(session);
  }

  useEffect(() => {
    if (!session || session.role !== "company" || activeTab !== "dashboard") return;
    void (async () => {
      const response = await fetch(`/api/joblink/dashboard?company_id=${session.user_id}`);
      const payload = (await response.json()) as typeof dashboardRows;
      setDashboardRows(payload);
    })();
  }, [activeTab, session]);

  if (!session) {
    return <div className="p-8 text-white">Session introuvable. Veuillez vous reconnecter.</div>;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-xl font-bold text-transparent">
            JobLINK
          </div>
          <input
            value={query}
            onChange={(event) => void handleSearch(event.target.value)}
            placeholder="Rechercher un compte..."
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          />
          <button onClick={() => setActiveTab("feed")} className={`rounded-lg px-3 py-2 text-sm ${activeTab === "feed" ? "bg-blue-500" : "bg-zinc-800"}`}>
            Fil
          </button>
          <button onClick={() => setActiveTab("account")} className={`rounded-lg px-3 py-2 text-sm ${activeTab === "account" ? "bg-violet-500" : "bg-zinc-800"}`}>
            Compte
          </button>
          {session.role === "company" ? (
            <button onClick={() => setActiveTab("dashboard")} className={`rounded-lg px-3 py-2 text-sm ${activeTab === "dashboard" ? "bg-emerald-500" : "bg-zinc-800"}`}>
              Dashboard
            </button>
          ) : null}
        </div>
      </header>

      {searchResults ? (
        <div className="mx-auto mt-4 max-w-7xl rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="mb-2 text-sm text-zinc-300">Resultats recherche</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1 text-xs text-zinc-400">Societes</p>
              {searchResults.companies.map((item) => (
                <p key={item.id} className="text-sm">{item.commercial_name}</p>
              ))}
            </div>
            <div>
              <p className="mb-1 text-xs text-zinc-400">Candidats</p>
              {searchResults.candidates.map((item) => (
                <p key={item.id} className="text-sm">{item.first_name} {item.last_name}</p>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-6">
        {activeTab === "feed" ? (
          <div className="space-y-4">
            {session.role === "candidate"
              ? feed?.jobs.map((job) => (
                  <article key={job.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <p className="text-xs text-zinc-400">{new Date(job.created_at).toLocaleString()}</p>
                    <h2 className="mt-1 text-lg font-semibold">{job.title}</h2>
                    <p className="mt-1 text-sm text-zinc-300">{job.description}</p>
                    <p className="mt-2 text-xs text-zinc-400">Skills: {job.hard_skills.join(", ")}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {new Date(job.apply_deadline).getTime() > currentTime ? (
                        <button className="rounded-md bg-blue-500 px-3 py-2 text-sm" onClick={() => void apply(job.id)}>
                          Postuler
                        </button>
                      ) : null}
                      <button className="rounded-md bg-zinc-700 px-3 py-2 text-sm" onClick={() => void follow(job.company_id)}>
                        Suivre societe
                      </button>
                    </div>
                  </article>
                ))
              : null}

            {session.role === "company"
              ? (
                  <>
                    {feed?.candidates.map((candidate) => (
                      <article key={`cand-${candidate.id}`} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                        <h2 className="text-lg font-semibold">{candidate.first_name} {candidate.last_name}</h2>
                        <p className="text-sm text-zinc-300">{candidate.cv.bio || "CV en attente de publication."}</p>
                      </article>
                    ))}
                    {feed?.jobs.map((job) => (
                      <article key={`job-${job.id}`} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-zinc-300">{job.description}</p>
                        <button className="mt-2 rounded-md bg-zinc-700 px-3 py-2 text-sm" onClick={() => void follow(job.company_id)}>
                          Suivre societe
                        </button>
                      </article>
                    ))}
                  </>
                )
              : null}

            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="font-semibold">Messages</h3>
              <div className="mt-2 space-y-2">
                {feed?.messages.map((message) => (
                  <p key={message.id} className="rounded-md bg-zinc-800 p-2 text-sm">
                    {message.content}
                  </p>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {activeTab === "account" && session.role === "candidate" ? (
          <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-semibold">Formulaire CV</h3>
            <textarea
              value={cvForm.bio}
              onChange={(event) => setCvForm((prev) => ({ ...prev, bio: event.target.value }))}
              placeholder="Bio"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
            />
            <div>
              <p className="mb-2 text-sm text-zinc-300">Education</p>
              {cvForm.education.map((item, idx) => (
                <div key={`edu-${idx}`} className="mb-2 grid gap-2 md:grid-cols-2">
                  <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Debut (mois/annee)" value={item.start_month} onChange={(e) => setCvForm((prev) => ({ ...prev, education: prev.education.map((row, i) => i === idx ? { ...row, start_month: e.target.value } : row) }))} />
                  <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Fin (mois/annee)" value={item.end_month} onChange={(e) => setCvForm((prev) => ({ ...prev, education: prev.education.map((row, i) => i === idx ? { ...row, end_month: e.target.value } : row) }))} />
                  <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Etablissement" value={item.institution} onChange={(e) => setCvForm((prev) => ({ ...prev, education: prev.education.map((row, i) => i === idx ? { ...row, institution: e.target.value } : row) }))} />
                  <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Diplome" value={item.degree} onChange={(e) => setCvForm((prev) => ({ ...prev, education: prev.education.map((row, i) => i === idx ? { ...row, degree: e.target.value } : row) }))} />
                </div>
              ))}
              <button onClick={() => setCvForm((prev) => ({ ...prev, education: [...prev.education, emptyCvItem()] }))} className="rounded-md bg-zinc-700 px-2 py-1 text-xs">+ Ajouter</button>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Hard skills (a,b,c)" onChange={(e) => setCvForm((prev) => ({ ...prev, hard_skills: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) }))} />
              <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Soft skills (a,b,c)" onChange={(e) => setCvForm((prev) => ({ ...prev, soft_skills: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) }))} />
            </div>
            <button onClick={() => void saveCv()} className="rounded-lg bg-violet-500 px-3 py-2 text-sm">Partager CV</button>
          </section>
        ) : null}

        {activeTab === "account" && session.role === "company" ? (
          <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="text-lg font-semibold">Publier une offre</h3>
            <input className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Titre poste" value={jobForm.title} onChange={(e) => setJobForm((prev) => ({ ...prev, title: e.target.value }))} />
            <input className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Departement" value={jobForm.department} onChange={(e) => setJobForm((prev) => ({ ...prev, department: e.target.value }))} />
            {(["hard_skills", "diplomas", "soft_skills", "certifications", "languages"] as const).map((field) => (
              <div key={field}>
                <p className="mb-1 text-xs text-zinc-400">{field}</p>
                {jobForm[field].map((value, idx) => (
                  <input
                    key={`${field}-${idx}`}
                    className="mb-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
                    value={value}
                    onChange={(e) =>
                      setJobForm((prev) => ({
                        ...prev,
                        [field]: prev[field].map((item, i) => (i === idx ? e.target.value : item)),
                      }))
                    }
                  />
                ))}
                <button className="rounded-md bg-zinc-700 px-2 py-1 text-xs" onClick={() => setJobForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }))}>
                  + Ajouter
                </button>
              </div>
            ))}
            <div className="grid gap-2 md:grid-cols-2">
              <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Adresse" value={jobForm.address} onChange={(e) => setJobForm((prev) => ({ ...prev, address: e.target.value }))} />
              <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Code postal" value={jobForm.postal_code} onChange={(e) => setJobForm((prev) => ({ ...prev, postal_code: e.target.value }))} />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <input type="number" min={1} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Nb postes" value={jobForm.positions_count} onChange={(e) => setJobForm((prev) => ({ ...prev, positions_count: Number(e.target.value || 1) }))} />
              <input type="date" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" value={jobForm.apply_deadline} onChange={(e) => setJobForm((prev) => ({ ...prev, apply_deadline: e.target.value }))} />
              <input type="date" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" value={jobForm.interview_deadline} onChange={(e) => setJobForm((prev) => ({ ...prev, interview_deadline: e.target.value }))} />
            </div>
            <textarea className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Description poste" value={jobForm.description} onChange={(e) => setJobForm((prev) => ({ ...prev, description: e.target.value }))} />
            <button onClick={() => void publishJob()} className="rounded-lg bg-emerald-500 px-3 py-2 text-sm">Partager offre</button>
          </section>
        ) : null}

        {activeTab === "dashboard" && session.role === "company" ? (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-lg font-semibold">Dashboard candidatures</h3>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-left text-zinc-300">
                    <th className="px-2 py-2">Candidat</th>
                    <th className="px-2 py-2">Offre</th>
                    <th className="px-2 py-2">Score</th>
                    <th className="px-2 py-2">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardRows.map((row) => (
                    <tr key={row.application.id} className="border-b border-zinc-800">
                      <td className="px-2 py-2">
                        {row.candidate ? `${row.candidate.first_name} ${row.candidate.last_name}` : row.application.candidate_id}
                        {row.candidate ? <p className="text-xs text-zinc-400">{row.candidate.email} | {row.candidate.phone}</p> : null}
                        {row.cv ? <p className="text-xs text-zinc-400">{row.cv.bio}</p> : null}
                      </td>
                      <td className="px-2 py-2">{row.job?.title ?? row.application.job_id}</td>
                      <td className="px-2 py-2">{row.application.score}</td>
                      <td className="px-2 py-2">{row.application.decision}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
