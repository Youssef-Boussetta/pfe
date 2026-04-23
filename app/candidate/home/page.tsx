import Link from "next/link";
import { CandidateHomeList } from "@/components/home-list";
import { getFeedSnapshot } from "@/lib/recruitment-service";

export default async function CandidateHomePage() {
  const feed = await getFeedSnapshot();

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Espace Candidat</h1>
            <p className="text-sm text-zinc-600">Visualisation des profils societes.</p>
          </div>
          <Link href="/" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm">
            Changer de role
          </Link>
        </div>
        <CandidateHomeList companies={feed.companies} />
      </div>
    </main>
  );
}
