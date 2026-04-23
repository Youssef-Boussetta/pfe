import { notFound } from "next/navigation";
import { AuthForm } from "@/components/auth-form";

type Role = "candidate" | "company";

export default async function SignupPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (role !== "candidate" && role !== "company") notFound();
  return <AuthForm role={role as Role} mode="signup" />;
}
