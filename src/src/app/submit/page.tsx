import Link from "next/link";
import { getAllGayborhoods } from "@/lib/db";
import SubmitForm from "@/components/SubmitForm";

type Props = {
  searchParams: Promise<{ city?: string }>;
};

export default async function SubmitPage({ searchParams }: Props) {
  const params = await searchParams;
  const citySlug = params.city ?? null;

  const gayborhoods = await getAllGayborhoods();
  const activeSlugs = gayborhoods.filter((g) => g.is_active).map((g) => g.slug);
  const defaultSlug = citySlug && activeSlugs.includes(citySlug) ? citySlug : null;

  return (
    <div className="min-h-screen bg-paper">
      <main id="main-content" className="mx-auto max-w-board px-[18px] pb-12 pt-8">
        <h1 className="font-bebas text-2xl tracking-[2px] text-ink">POST SOMETHING</h1>
        <p className="mt-2 font-courier text-sm text-faded">
          No account needed. Pick a city and category, then post.
        </p>
        <p className="mt-4 font-courier text-sm text-faded">
          <Link href="/la-westside" className="text-link hover:underline">
            ← Back to board
          </Link>
        </p>

        <div className="mt-8">
          <SubmitForm
            gayborhoods={gayborhoods.map((g) => ({
              slug: g.slug,
              name: g.name,
              is_active: g.is_active,
            }))}
            defaultSlug={defaultSlug}
          />
        </div>
      </main>
    </div>
  );
}
