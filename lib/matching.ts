import type { Candidate, Job } from "@/lib/types";

const tokenize = (values: string[]) =>
  values
    .flatMap((entry) => entry.toLowerCase().split(/[\s,;/]+/))
    .map((token) => token.trim())
    .filter(Boolean);

const toFrequencyMap = (tokens: string[]) => {
  const map = new Map<string, number>();
  for (const token of tokens) {
    map.set(token, (map.get(token) ?? 0) + 1);
  }
  return map;
};

const cosineSimilarity = (a: Map<string, number>, b: Map<string, number>) => {
  const vocab = new Set([...a.keys(), ...b.keys()]);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const token of vocab) {
    const valueA = a.get(token) ?? 0;
    const valueB = b.get(token) ?? 0;
    dot += valueA * valueB;
    normA += valueA ** 2;
    normB += valueB ** 2;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

export function scoreCandidateForJob(candidate: Candidate, job: Job): number {
  const cvTokens = tokenize([
    ...candidate.cv.hard_skills,
    ...candidate.cv.soft_skills,
    ...candidate.cv.education.map((item) => item.degree),
    ...candidate.cv.certifications.map((item) => item.name),
    ...candidate.cv.languages.map((item) => item.language),
    candidate.cv.bio,
  ]);

  const jobTokens = tokenize([
    ...job.hard_skills,
    ...job.soft_skills,
    ...job.diplomas,
    ...job.certifications,
    ...job.languages,
    job.title,
    job.description,
  ]);

  const similarity = cosineSimilarity(toFrequencyMap(cvTokens), toFrequencyMap(jobTokens));
  return Number((similarity * 100).toFixed(2));
}
