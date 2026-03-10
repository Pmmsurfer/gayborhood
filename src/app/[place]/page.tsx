import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isPowerUser } from "@/lib/powerUser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import CommunityList from "./CommunityList";

type Props = { params: { place: string } };

export default async function PlacePage({ params }: Props) {
  const { place } = params;

  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured");
  }
  const admin = supabaseAdmin as NonNullable<typeof supabaseAdmin>;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const powerUser = isPowerUser(user?.email ?? undefined);

  const [{ data: placeRow }, { data: communities }] = await Promise.all([
    admin.from("places").select("*").eq("slug", place).single(),
    admin
      .from("communities")
      .select("*")
      .eq("place_slug", place)
      .order("name", { ascending: true }),
  ]);

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
            const { count } = await admin
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

      <div className="mt-6">
        <CommunityList
          place={place}
          communities={communitiesWithCounts}
          isPowerUser={powerUser}
        />
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