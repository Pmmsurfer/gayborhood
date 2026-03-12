import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
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

  const supabaseAuth = await createClient();
  if (!supabaseAuth) {
    redirect(
      "/login?next=" + encodeURIComponent(`/${place}/${community}/submit`)
    );
  }
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    redirect(
      "/login?next=" + encodeURIComponent(`/${place}/${community}/submit`)
    );
  }

  if (!supabaseAdmin) {
    return (
      <main id="main-content" className="mx-auto max-w-board px-[18px] py-12 font-courier text-sm text-faded">
        <p>Server configuration error. Set SUPABASE_SERVICE_ROLE_KEY in the deployment environment.</p>
        <Link href={`/${place}/${community}`} className="mt-4 inline-block text-link hover:underline">← Back to board</Link>
      </main>
    );
  }

  const [{ data: placeRow }, { data: communityRow }] = await Promise.all([
    supabaseAdmin.from("places").select("*").eq("slug", place).single(),
    supabaseAdmin
      .from("communities")
      .select("*")
      .eq("place_slug", place)
      .eq("slug", community)
      .single(),
  ]);

  if (!placeRow || !communityRow) {
    return (
      <main id="main-content" className="mx-auto max-w-board px-[18px] py-12 font-courier text-sm text-faded">
        <p>Place or community not found: <strong>{place}/{community}</strong>. Check that the place and community exist in the database and the URL matches their slugs.</p>
        <Link href={`/${place}`} className="mt-4 inline-block text-link hover:underline">← Back to {place}</Link>
      </main>
    );
  }

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

