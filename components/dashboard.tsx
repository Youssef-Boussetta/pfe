"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { FeedPayload } from "@/lib/types";

const cardAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

export function Dashboard({ initialFeed }: { initialFeed: FeedPayload }) {
  const [feed, setFeed] = useState<FeedPayload | null>(initialFeed);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  async function refreshFeed() {
    setLoading(true);
    const response = await fetch("/api/feed", { cache: "no-store" });
    const data = (await response.json()) as FeedPayload;
    setFeed(data);
    setLoading(false);
  }

  async function runMatching() {
    if (!feed?.candidates?.[0] || !feed?.jobs?.[0]) return;
    await fetch("/api/matching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: feed.candidates[0].id, jobId: feed.jobs[0].id }),
    });
    await fetch("/api/decisions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: feed.jobs[0].id, topN: 1 }),
    });
    await refreshFeed();
  }

  const acceptedCount = useMemo(
    () => feed?.applications.filter((item) => item.decision === "accepted").length ?? 0,
    [feed],
  );
  const suggestions = useMemo(() => {
    if (!feed || !search.trim()) return [];
    const term = search.toLowerCase();
    const jobs = feed.jobs
      .filter((job) => job.title.toLowerCase().includes(term))
      .slice(0, 4)
      .map((job) => `Offre: ${job.title}`);
    const candidates = feed.candidates
      .filter((candidate) => `${candidate.first_name} ${candidate.last_name}`.toLowerCase().includes(term))
      .slice(0, 4)
      .map((candidate) => `Candidat: ${candidate.first_name} ${candidate.last_name}`);
    return [...jobs, ...candidates];
  }, [feed, search]);
  const filteredApplications = useMemo(() => {
    if (!feed) return [];
    const term = search.toLowerCase().trim();
    if (!term) return feed.applications;
    return feed.applications.filter((item) => {
      return (
        item.candidate_id.toLowerCase().includes(term) ||
        item.job_id.toLowerCase().includes(term) ||
        item.decision.toLowerCase().includes(term)
      );
    });
  }, [feed, search]);

  useEffect(() => {
    const timer = setInterval(() => {
      void refreshFeed();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-white to-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <motion.div
          {...cardAnim}
          className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-950 p-6 text-white shadow-xl md:p-8"
        >
          <div className="pointer-events-none absolute -top-28 right-[-40px] h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-[-50px] h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
          <p className="mb-2 inline-flex rounded-full border border-cyan-300/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
            Smart HR Platform
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Plateforme RH intelligente</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-300 md:text-base">
            Automatisez le recrutement avec matching CV/offres, decision intelligente, messagerie interne et contrats.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher candidat, offre ou decision"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-cyan-400"
              />
              {suggestions.length > 0 ? (
                <div className="absolute left-0 right-0 top-14 z-20 rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-300 shadow-xl">
                  {suggestions.map((item) => (
                    <p key={item} className="rounded-md px-2 py-1 hover:bg-zinc-800">
                      {item}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
              onClick={() => void runMatching()}
            >
              Lancer pipeline
            </button>
            <button
              className="rounded-xl border border-zinc-600 px-4 py-3 text-sm font-medium transition hover:border-zinc-400 hover:bg-zinc-900"
              onClick={() => void refreshFeed()}
            >
              Rafraichir
            </button>
          </div>
        </motion.div>

        {loading || !feed ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-28 animate-pulse rounded-2xl bg-zinc-200/70" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <motion.div {...cardAnim} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">Candidats</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-900">{feed.candidates.length}</p>
              <p className="mt-1 text-xs text-zinc-500">Profils disponibles</p>
            </motion.div>
            <motion.div {...cardAnim} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">Offres</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-900">{feed.jobs.length}</p>
              <p className="mt-1 text-xs text-zinc-500">Postes actifs</p>
            </motion.div>
            <motion.div {...cardAnim} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-zinc-500">Acceptes</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-900">{acceptedCount}</p>
              <p className="mt-1 text-xs text-zinc-500">Candidatures validees</p>
            </motion.div>
          </div>
        )}

        <motion.div {...cardAnim} className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900">Feed applications</h2>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {filteredApplications.length} resultats
            </span>
          </div>
          <div className="space-y-2">
            {filteredApplications.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
                Aucune application pour le moment.
              </p>
            ) : (
              filteredApplications.map((item) => (
                <div key={item.id} className="rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-zinc-900">
                      {item.candidate_id} - {item.job_id}
                    </p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        item.decision === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.decision === "rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.decision}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">Score de matching: {item.score}%</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
