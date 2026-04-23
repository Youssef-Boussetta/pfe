import { NextResponse } from "next/server";
import { getFeedSnapshot } from "@/lib/recruitment-service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  const q = (url.searchParams.get("q") ?? "").toLowerCase().trim();

  const { jobs } = await getFeedSnapshot();
  const filtered = jobs.filter((job) => {
    const title = String((job as { title?: string }).title ?? "").toLowerCase();
    const department = String((job as { department?: string }).department ?? "").toLowerCase();
    return !q || title.includes(q) || department.includes(q);
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
