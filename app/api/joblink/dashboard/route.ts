import { NextResponse } from "next/server";
import { z } from "zod";
import { getCompanyDashboard } from "@/lib/joblink-service";

const schema = z.object({
  company_id: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const data = schema.parse({ company_id: url.searchParams.get("company_id") });
    return NextResponse.json(getCompanyDashboard(data.company_id));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
