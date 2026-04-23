"use server";

import { revalidatePath } from "next/cache";
import { createContractPdf, runDecision, runMatching } from "@/lib/recruitment-service";

export async function launchMatchingAction(candidateId: string, jobId: string) {
  const app = await runMatching(candidateId, jobId);
  revalidatePath("/");
  return app;
}

export async function launchDecisionAction(jobId: string, topN: number) {
  const decisions = await runDecision(jobId, topN);
  revalidatePath("/");
  return decisions;
}

export async function generateContractAction(input: {
  candidate_id: string;
  job_id: string;
  company_id: string;
  contract_type: string;
  salary: number;
  start_date: string;
}) {
  const contract = await createContractPdf(input);
  revalidatePath("/");
  return contract;
}
