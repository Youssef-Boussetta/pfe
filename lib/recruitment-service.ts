import { jsPDF } from "jspdf";
import { addDoc, collection, doc, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { mockCandidates, mockCompanies, mockJobs } from "@/lib/mock-data";
import { scoreCandidateForJob } from "@/lib/matching";
import type { Application, Candidate, Company, ContractDoc, FeedPayload, InternalMessage, Interview, Job } from "@/lib/types";

const applications: Application[] = [];
const messages: InternalMessage[] = [];
const interviews: Interview[] = [];
const contracts: ContractDoc[] = [];
let seeded = false;

async function ensureSeedData() {
  if (!isFirebaseConfigured || seeded) return;
  const candidatesSnap = await getDocs(query(collection(db!, "candidates"), limit(1)));
  if (!candidatesSnap.empty) {
    seeded = true;
    return;
  }
  await Promise.all([
    ...mockCompanies.map((item) => addDoc(collection(db!, "companies"), item)),
    ...mockCandidates.map((item) => addDoc(collection(db!, "candidates"), item)),
    ...mockJobs.map((item) => addDoc(collection(db!, "jobs"), item)),
  ]);
  seeded = true;
}

export async function runMatching(candidateId: string, jobId: string) {
  if (isFirebaseConfigured) {
    await ensureSeedData();
    const candidateSnap = await getDocs(query(collection(db!, "candidates"), where("id", "==", candidateId), limit(1)));
    const jobSnap = await getDocs(query(collection(db!, "jobs"), where("id", "==", jobId), limit(1)));
    const candidate = candidateSnap.docs[0]?.data() as typeof mockCandidates[number] | undefined;
    const job = jobSnap.docs[0]?.data() as typeof mockJobs[number] | undefined;
    if (!candidate || !job) throw new Error("Candidate or job not found.");

    const application: Application = {
      id: `app_${crypto.randomUUID()}`,
      candidate_id: candidateId,
      job_id: jobId,
      score: scoreCandidateForJob(candidate, job),
      decision: "pending",
      created_at: new Date().toISOString(),
    };
    await addDoc(collection(db!, "applications"), application);
    return application;
  }

  const candidate = mockCandidates.find((item) => item.id === candidateId);
  const job = mockJobs.find((item) => item.id === jobId);

  if (!candidate || !job) {
    throw new Error("Candidate or job not found.");
  }

  const score = scoreCandidateForJob(candidate, job);
  const application: Application = {
    id: `app_${crypto.randomUUID()}`,
    candidate_id: candidateId,
    job_id: jobId,
    score,
    decision: "pending",
    created_at: new Date().toISOString(),
  };
  applications.push(application);
  return application;
}

export async function runDecision(jobId: string, topN: number) {
  if (isFirebaseConfigured) {
    const appSnap = await getDocs(query(collection(db!, "applications"), where("job_id", "==", jobId)));
    const targeted = appSnap.docs.map((item) => ({ id: item.id, ...item.data() })) as Array<Application & { id: string }>;
    targeted.sort((a, b) => b.score - a.score);
    const acceptedIds = new Set(targeted.slice(0, topN).map((item) => item.id));
    await Promise.all(
      targeted.map((item) =>
        updateDoc(doc(db!, "applications", item.id), {
          decision: acceptedIds.has(item.id) ? "accepted" : "rejected",
        }),
      ),
    );
    return targeted.map((item) => ({
      ...item,
      decision: acceptedIds.has(item.id) ? "accepted" : "rejected",
    }));
  }

  const targeted = applications.filter((item) => item.job_id === jobId).sort((a, b) => b.score - a.score);

  const acceptedIds = new Set(targeted.slice(0, topN).map((item) => item.id));
  targeted.forEach((item) => {
    item.decision = acceptedIds.has(item.id) ? "accepted" : "rejected";
  });

  return targeted;
}

export async function sendInternalMessage(
  payload: Omit<InternalMessage, "id" | "read" | "created_at">,
) {
  const message: InternalMessage = {
    ...payload,
    id: `msg_${crypto.randomUUID()}`,
    read: false,
    created_at: new Date().toISOString(),
  };
  if (isFirebaseConfigured) {
    await addDoc(collection(db!, "messages"), message);
  } else {
    messages.push(message);
  }
  return message;
}

export async function confirmInterview(interviewId: string, selectedSlot: { date: string; time: string }) {
  if (isFirebaseConfigured) {
    const interviewSnap = await getDocs(query(collection(db!, "interviews"), where("id", "==", interviewId), limit(1)));
    const first = interviewSnap.docs[0];
    if (!first) throw new Error("Interview not found.");
    await updateDoc(doc(db!, "interviews", first.id), { selected_slot: selectedSlot, status: "confirmed" });
    return { ...(first.data() as Interview), selected_slot: selectedSlot, status: "confirmed" };
  }

  const existing = interviews.find((item) => item.id === interviewId);
  if (!existing) throw new Error("Interview not found.");
  existing.selected_slot = selectedSlot;
  existing.status = "confirmed";
  return existing;
}

export async function createContractPdf(input: {
  candidate_id: string;
  job_id: string;
  company_id: string;
  contract_type: string;
  salary: number;
  start_date: string;
}) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Employment Contract", 20, 25);
  doc.setFontSize(11);
  doc.text(`Candidate: ${input.candidate_id}`, 20, 40);
  doc.text(`Job: ${input.job_id}`, 20, 48);
  doc.text(`Company: ${input.company_id}`, 20, 56);
  doc.text(`Contract type: ${input.contract_type}`, 20, 64);
  doc.text(`Salary: ${input.salary}`, 20, 72);
  doc.text(`Start date: ${input.start_date}`, 20, 80);

  const base64Pdf = doc.output("datauristring");

  const contract: ContractDoc = {
    id: `ctr_${crypto.randomUUID()}`,
    candidate_id: input.candidate_id,
    job_id: input.job_id,
    company_id: input.company_id,
    contract_type: input.contract_type,
    salary: input.salary,
    start_date: input.start_date,
    pdf_url: base64Pdf,
    created_at: new Date().toISOString(),
  };
  if (isFirebaseConfigured) {
    await addDoc(collection(db!, "contracts"), contract);
  } else {
    contracts.push(contract);
  }
  return contract;
}

export async function getFeedSnapshot(): Promise<FeedPayload> {
  if (isFirebaseConfigured) {
    await ensureSeedData();
    const [companiesSnap, candidatesSnap, jobsSnap, appSnap, msgSnap, interviewSnap, contractSnap] = await Promise.all([
      getDocs(query(collection(db!, "companies"), orderBy("created_at", "desc"))),
      getDocs(query(collection(db!, "candidates"), orderBy("created_at", "desc"))),
      getDocs(query(collection(db!, "jobs"), orderBy("created_at", "desc"))),
      getDocs(query(collection(db!, "applications"), orderBy("created_at", "desc"))),
      getDocs(query(collection(db!, "messages"), orderBy("created_at", "desc"))),
      getDocs(query(collection(db!, "interviews"), orderBy("created_at", "desc"))),
      getDocs(query(collection(db!, "contracts"), orderBy("created_at", "desc"))),
    ]);
    return {
      companies: companiesSnap.docs.map((d) => d.data() as Company),
      candidates: candidatesSnap.docs.map((d) => d.data() as Candidate),
      jobs: jobsSnap.docs.map((d) => d.data() as Job),
      applications: appSnap.docs.map((d) => d.data() as Application),
      messages: msgSnap.docs.map((d) => d.data() as InternalMessage),
      interviews: interviewSnap.docs.map((d) => d.data() as Interview),
      contracts: contractSnap.docs.map((d) => d.data() as ContractDoc),
    };
  }

  return { companies: mockCompanies, candidates: mockCandidates, jobs: mockJobs, applications, messages, interviews, contracts };
}
