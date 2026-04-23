import { NextResponse } from "next/server";
import { z } from "zod";
import { loginWithCredentials } from "@/lib/joblink-service";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const data = loginSchema.parse(await request.json());
    const user = loginWithCredentials(data.email, data.password);
    return NextResponse.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inattendue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
