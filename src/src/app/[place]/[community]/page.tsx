import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StickyNav from "@/components/StickyNav";
import SectionNav from "@/components/SectionNav";
import ThisWeekSection from "@/components/ThisWeekSection";
import PostCard from "@/components/PostCard";
import MissedConnectionCard from "@/components/MissedConnectionCard";
import AnonCard from "@/components/AnonCard";
import ClassifiedItem from "@/components/ClassifiedItem";
import PaidEventCard from "@/components/PaidEventCard";
import RecCard from "@/components/RecCard";

type Params = { place: string; community: string };
type Props = { params: Params };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { place, community } = params;
  return {
    title: `${place}/${community} — Gayborhood`,
    description: `Community board for ${place}/${community}`,
  };
}

export default async function CommunityPage({ params }: Props) {
  const { place, community } = params;

  if (!supabase) throw new Error("Supabase not configured");

  // Ensure place + community exist
  const [{ data: placeRow }, { data: communityRow }] = await Promise.all([
    supabase.from("places").select("*").eq("slug", place).single(),
    supabase
      .from("communities")
      .select("*")
      .eq("place_slug", place)
      .eq("slug", community)
      .single(),
  ]);

  if (!placeRow || !communityRow) notFound();

  const today = new Date().toISOString().slice(0, 10);

  const [
    thisWeekRes,
    boardRes,
    missedRes,
    anonRes,
    classifiedsRes,
    hostedRes,
    recsRes,
    counts,
  ] = await Promise.all([
    // This Week: upcoming events
    supabase
      .from("posts")
      .select("*")
      .eq("place_slug", place)
      .eq("community_slug", community)
      .eq("is_approved", true)
      .not("event_date", "is", null)
      .gte("event_date", today)
      .order("event_date", { ascending: true }),
    // Board: non‑event, non‑classified
    supabase
      .from("posts")
      .select("*")
      .eq("place_slug", place)
      .eq("community_slug", community)
      .eq("is_approved", true)
      .is("event_date", null)
      .not(
        "category",
        "in",
        "(roommate,gear,borrow,lend,skill_swap,missed_connection,anonymous,recommendation)"
      )
      .order("created_at", { ascending: false }),
    // Missed connections
    supabase
      .from("posts")
      .select("*")
      .eq("place_slug", place)
      .eq("community_slug", community)
      .eq("category", "missed_connection")
      .eq("is_approved", true)
      .order("created_at", { ascending: false }),
    // Anonymous
    supabase
      .from("posts")
      .select("*")
      .eq("place_slug", place)
      .eq("community_slug", community)
      .eq("category", "anonymous")
      .eq("is_approved", true)
      .order("like_count", { ascending: false }),
    // Classifieds
    supabase
      .from("posts")
      .select("*")
      .eq("place_slug", place)
      .eq("community_slug", community)
      .eq("is_approved", true)
      .in("category", ["roommate", "gear", "borrow", "lend", "skill_swap"])
      .order("created_at", { ascending: false }),
    // Hosted experiences (paid)
    supabase
      .from("posts")
      .select("*")
      .eq("place_slug", place)
      .eq("community_slug", community)
      .eq("is_approved", true)
      .gt("price_cents", 0)
      .order("event_date", { ascending: true }),
    // Recommendations
    supabase
      .from("posts")
      .select("*")
      .eq("place_slug", place)
      .eq("community_slug", community)
      .eq("category", "recommendation")
      .eq("is_approved", true)
      .order("like_count", { ascending: false }),
    // Counts for section nav
    Promise.all([
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("place_slug", place)
        .eq("community_slug", community)
        .not("event_date", "is", null)
        .gte("event_date", today),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("place_slug", place)
        .eq("community_slug", community)
        .is("event_date", null)
        .not(
          "category",
          "in",
          "(roommate,gear,borrow,lend,skill_swap,missed_connection,anonymous,recommendation)"
        ),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("place_slug", place)
        .eq("community_slug", community)
        .eq("category", "missed_connection"),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("place_slug", place)
        .eq("community_slug", community)
        .eq("category", "anonymous"),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("place_slug", place)
        .eq("community_slug", community)
        .in("category", ["roommate", "gear", "borrow", "lend", "skill_swap"]),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("place_slug", place)
        .eq("community_slug", community)
        .gt("price_cents", 0),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("place_slug", place)
        .eq("community_slug", community)
        .eq("category", "recommendation"),
    ]),
  ]);

  const [
    thisWeekCount,
    boardCount,
    missedCount,
    anonCount,
    classifiedsCount,
    hostedCount,
    recsCount,
  ] = counts;

  const sectionCounts = {
    thisWeek: thisWeekCount.count ?? 0,
    board: boardCount.count ?? 0,
    missedConnections: missedCount.count ?? 0,
    anonymous: anonCount.count ?? 0,
    classifieds: classifiedsCount.count ?? 0,
    hosted: hostedCount.count ?? 0,
    recs: recsCount.count ?? 0,
  };

  const classifieds = classifiedsRes.data ?? [];
  const leftClassifieds = classifieds.filter((p: any) =>
    ["roommate", "borrow", "lend", "skill_swap"].includes(p.category)
  );
  const rightClassifieds = classifieds.filter(
    (p: any) => p.category === "gear"
  );

  return (
    <div className="min-h-screen bg-paper">
      <StickyNav />

      <main
        id="main-content"
        className="mx-auto max-w-board px-[18px] pb-12 pt-6"
      >
        {/* Masthead */}
        <header className="mb-8">
          <h1 className="font-bebas text-3xl tracking-[2px] text-ink">
            <span className="text-faded">{place}/</span>
            <span className="text-ink">{community}</span>
          </h1>
          <p className="mt-4 font-courier text-sm text-faded">
            <Link
              href={`/${place}/new`}
              className="text-link hover:underline"
            >
              start a community here →
            </Link>
          </p>
        </header>

        <SectionNav counts={sectionCounts} />

        {/* This Week */}
        <ThisWeekSection events={(thisWeekRes.data ?? []) as any} />

        {/* Recurring crews — to be wired from `crews` later */}

        {/* The Board */}
        <section id="board" className="mb-10">
          <h2 className="section-head font-bebas tracking-[2px] text-ink">
            THE BOARD
          </h2>
          <div className="space-y-0">
            {(boardRes.data ?? []).length === 0 ? (
              <p className="font-courier text-sm text-faded">
                No posts yet. Be the first.
              </p>
            ) : (
              (boardRes.data ?? []).map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

        {/* Missed Connections */}
        <section id="missed" className="mb-10">
          <h2 className="section-head font-bebas tracking-[2px] text-ink">
            MISSED CONNECTIONS
          </h2>
          <div className="space-y-0">
            {(missedRes.data ?? []).length === 0 ? (
              <p className="font-courier text-sm text-faded">
                No missed connections.
              </p>
            ) : (
              (missedRes.data ?? []).map((post: any) => (
                <MissedConnectionCard key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

        {/* Anonymous */}
        <section id="anonymous" className="mb-10">
          <h2 className="section-head font-bebas tracking-[2px] text-ink">
            ANONYMOUS
          </h2>
          <div className="space-y-0">
            {(anonRes.data ?? []).length === 0 ? (
              <p className="font-courier text-sm text-faded">
                No anonymous posts.
              </p>
            ) : (
              (anonRes.data ?? []).map((post: any) => (
                <AnonCard key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

        {/* Classifieds */}
        <section id="classifieds" className="mb-10">
          <h2 className="section-head font-bebas tracking-[2px] text-ink">
            CLASSIFIEDS
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-courier text-sm font-bold text-ink">
                Roommates · Borrowed & Lent · Skill Swaps
              </p>
              <div className="space-y-0">
                {leftClassifieds.length === 0 ? (
                  <p className="font-courier text-sm text-faded">—</p>
                ) : (
                  leftClassifieds.map((post: any) => (
                    <ClassifiedItem key={post.id} post={post} />
                  ))
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 font-courier text-sm font-bold text-ink">
                Gear · Misc
              </p>
              <div className="space-y-0">
                {rightClassifieds.length === 0 ? (
                  <p className="font-courier text-sm text-faded">—</p>
                ) : (
                  rightClassifieds.map((post: any) => (
                    <ClassifiedItem key={post.id} post={post} />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Hosted Experiences */}
        <section id="hosted" className="mb-10">
          <h2 className="section-head font-bebas tracking-[2px] text-ink">
            HOSTED EXPERIENCES
          </h2>
          <div className="space-y-0">
            {(hostedRes.data ?? []).length === 0 ? (
              <p className="font-courier text-sm text-faded">
                No paid events right now.
              </p>
            ) : (
              (hostedRes.data ?? []).map((post: any) => (
                <PaidEventCard key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

        {/* Recommendations */}
        <section id="recs" className="mb-10">
          <h2 className="section-head font-bebas tracking-[2px] text-ink">
            RECOMMENDATIONS
          </h2>
          <div className="space-y-0">
            {(recsRes.data ?? []).length === 0 ? (
              <p className="font-courier text-sm text-faded">
                No recommendations yet.
              </p>
            ) : (
              (recsRes.data ?? []).map((post: any) => (
                <RecCard key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-rule pt-6 font-courier text-sm text-faded">
          {place}/{community} ·{" "}
          <Link
            href={`/${place}/${community}/submit`}
            className="text-link hover:underline"
          >
            post something
          </Link>{" "}
          ·{" "}
          <Link href={`/${place}/new`} className="text-link hover:underline">
            start a community
          </Link>{" "}
          ·{" "}
          <a
            href="mailto:hello@gayborhood.com"
            className="text-link hover:underline"
          >
            email
          </a>
        </footer>
      </main>
    </div>
  );
}
