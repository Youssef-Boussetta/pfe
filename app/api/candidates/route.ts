import { NextResponse } from "next/server";
import { getFeedSnapshot } from "@/lib/recruitment-service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  const q = (url.searchParams.get("q") ?? "").toLowerCase().trim();

  const { candidates } = await getFeedSnapshot();
  const filtered = candidates.filter((candidate) => {
    const firstName = String((candidate as { first_name?: string }).first_name ?? "").toLowerCase();
    const lastName = String((candidate as { last_name?: string }).last_name ?? "").toLowerCase();
    const skills = ((candidate as { cv?: { hard_skills?: string[] } }).cv?.hard_skills ?? []).join(" ").toLowerCase();
    return !q || firstName.includes(q) || lastName.includes(q) || skills.includes(q);
  });

  const start = (Math.max(page, 1) - 1) * Math.max(pageSize, 1);
  const paged = filtered.slice(start, start + Math.max(pageSize, 1));

  return NextResponse.json({
    data: paged,
    pagination: {
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / Math.max(pageSize, 1))),
    },
  });
}
