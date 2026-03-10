import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CommunitySubmitForm } from "./ui/CommunitySubmitForm";

type Params = { place: string; community: string };
type Props = { params: Params };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { place, community } = params;
  return {
    title: `Post to ${place}/${community} — Gayborhood`,
    description: `Post something to the ${place}/${community} board.`,
  };
}

export default async function CommunitySubmitPage({ params }: Props) {
  const { place, community } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      "/login?next=" + encodeURIComponent(`/${place}/${community}/submit`)
    );
  }

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

  return (
    <div className="min-h-screen bg-paper">
      <main
        id="main-content"
        className="mx-auto max-w-board px-[18px] pb-12 pt-8"
      >
        <h1 className="font-bebas text-2xl tracking-[2px] text-ink">
          POST TO{" "}
          <span className="text-faded">
            {place}/{community}
          </span>
        </h1>
        <p className="mt-2 font-courier text-sm text-faded">
          You must be signed in to post.
        </p>
        <p className="mt-4 font-courier text-sm text-faded">
          <Link
            href={`/${place}/${community}`}
            className="text-link hover:underline"
          >
            ← Back to board
          </Link>
        </p>

        <div className="mt-8">
          <CommunitySubmitForm
            place={place}
            community={community}
          />
        </div>
      </main>
    </div>
  );
}

