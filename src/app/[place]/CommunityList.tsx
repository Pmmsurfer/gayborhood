"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCommunity } from "@/actions/deleteCommunity";

type CommunityWithCounts = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_active: boolean;
  member_count: number | null;
  eventsThisWeek: number;
};

type Props = {
  place: string;
  communities: CommunityWithCounts[];
  isPowerUser: boolean;
};

export default function CommunityList({
  place,
  communities,
  isPowerUser,
}: Props) {
  const router = useRouter();

  async function handleDelete(communitySlug: string) {
    if (!confirm(`Delete community “${communitySlug}”? This will also delete all posts in it.`)) return;
    const result = await deleteCommunity(place, communitySlug);
    if (result.ok) router.refresh();
    else alert(result.error);
  }

  if (communities.length === 0) {
    return (
      <p className="text-faded">
        No communities here yet. Start the first one.
      </p>
    );
  }

  return (
    <div className="space-y-2 font-courier text-sm">
      {communities.map((c) => (
        <div key={c.id} className="flex flex-wrap items-center gap-x-2">
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
              ? `${c.member_count ?? 0} members · ${c.eventsThisWeek ?? 0} events this week`
              : "starting out"}
          </span>
          {isPowerUser && (
            <button
              type="button"
              onClick={() => handleDelete(c.slug)}
              className="text-brick hover:underline"
              aria-label={`Delete community ${c.slug}`}
            >
              delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
