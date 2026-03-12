import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isPowerUser } from "@/lib/powerUser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import CommunityList from "./CommunityList";

type Props = { params: { place: string } };

export default async function PlacePage({ params }: Props) {
  const { place } = params;

  if (!supabaseAdmin) {
    return (
      <main id="main-content" className="mx-auto max-w-board px-[18px] py-12 font-courier text-sm text-faded">
        <p>Server configuration error. Set SUPABASE_SERVICE_ROLE_KEY in the deployment environment.</p>
        <Link href="/" className="mt-4 inline-block text-link hover:underline">← Home</Link>
      </main>
    );
  }

  const admin = supabaseAdmin!;

  let user: { email?: string } | null = null;
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      user = data?.user ?? null;
    }
  } catch {
    // Continue without power user
  }
  const powerUser = isPowerUser(user?.email ?? undefined);

  try {
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
            if (!supabaseAdmin) throw new Error("supabaseAdmin is not initialized");
            const db = supabaseAdmin;
            const { count } = await db
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
  } catch (_err) {
    return (
      <main id="main-content" className="mx-auto max-w-board px-[18px] py-12 font-courier text-sm text-faded">
        <p>Something went wrong loading this page. Check that Supabase env vars (URL, anon key, service role key) are set in Vercel.</p>
        <Link href="/" className="mt-4 inline-block text-link hover:underline">← Home</Link>
      </main>
    );
  }
}