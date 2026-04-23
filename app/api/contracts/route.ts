import { NextResponse } from "next/server";
import { createContractPdf, sendInternalMessage } from "@/lib/recruitment-service";
import { contractCreateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const data = contractCreateSchema.parse(await request.json());
    const contract = await createContractPdf(data);

    await sendInternalMessage({
      sender_id: data.company_id,
      receiver_id: data.candidate_id,
      type: "contract",
      content: "Your contract is ready.",
      metadata: {
        job_id: data.job_id,
        company_id: data.company_id,
        pdf_url: contract.pdf_url,
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: detail }, { status: 400 });
  }
}
