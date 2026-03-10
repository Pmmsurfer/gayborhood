import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Props = { params: { place: string } };

export default async function PlacePage({ params }: Props) {
  const { place } = params;

  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured");
  }

  const [{ data: placeRow }, { data: communities }] = await Promise.all([
    supabaseAdmin.from("places").select("*").eq("slug", place).single(),
    supabaseAdmin
      .from("communities")
      .select("*")
      .eq("place_slug", place)
      .order("name", { ascending: true }),
  ]);

  console.log("PLACE_PAGE_COMMUNITIES", {
    place,
    count: communities?.length ?? 0,
    slugs: (communities ?? []).map((c: any) => c.slug),
  });

  if (!placeRow) {
    return (
      <main
        id="main-content"
        className="mx-auto max-w-board px-[18px] py-12 font-courier text-sm text-faded"
      >
        <p>Place not found.</p>
      </main>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const communitiesWithCounts =
    communities && communities.length > 0
      ? await Promise.all(
          communities.map(async (c: any) => {
            const { count } = await supabaseAdmin
              .from("posts")
              .select("id", { count: "exact", head: true })
              .eq("place_slug", place)
              .eq("community_slug", c.slug)
              .not("event_date", "is", null)
              .gte("event_date", today);
            return { ...c, eventsThisWeek: count ?? 0 };
          })
        )
      : [];

  return (
    <main
      id="main-content"
      className="mx-auto max-w-board px-[18px] py-12"
    >
      <h1 className="font-bebas text-3xl tracking-[2px] text-ink">
        {placeRow.slug}/
      </h1>

      <div className="mt-6 space-y-2 font-courier text-sm">
        {communitiesWithCounts.length === 0 ? (
          <p className="text-faded">
            No communities here yet. Start the first one.
          </p>
        ) : (
          communitiesWithCounts.map((c: any) => (
            <div key={c.id} className="flex flex-wrap gap-x-2">
              <Link
                href={`/${place}/${c.slug}`}
                className="min-w-[140px] text-link hover:underline"
              >
                {c.slug}
              </Link>
              <span className="flex-1 text-faded">
                {c.description ?? ""}
                {"  "}
                {c.is_active
                  ? `${c.member_count ?? 0} members · ${
                      c.eventsThisWeek ?? 0
                    } events this week`
                  : "starting out"}
              </span>
            </div>
          ))
        )}
      </div>

      <p className="mt-6 font-courier text-sm">
        <Link
          href={`/${place}/new`}
          className="text-link hover:underline"
        >
          + start a community here →
        </Link>
      </p>
    </main>
  );
}