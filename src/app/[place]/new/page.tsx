import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewCommunityForm } from "./ui/NewCommunityForm";

type Params = { place: string };
type Props = { params: Params };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { place } = params;
  return {
    title: `Start a community in ${place} — Gayborhood`,
    description: `Create a new community board in ${place}.`,
  };
}

export default async function NewCommunityPage({ params }: Props) {
  const { place } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=" + encodeURIComponent(`/${place}/new`));
  }

  const { data: placeRow } = await supabase
    .from("places")
    .select("*")
    .eq("slug", place)
    .single();

  if (!placeRow) notFound();

  return (
    <div className="min-h-screen bg-paper">
      <main
        id="main-content"
        className="mx-auto max-w-board px-[18px] pb-12 pt-6"
      >
        <header className="mb-6">
          <h1 className="font-bebas text-3xl tracking-[2px] text-ink">
            <span className="text-faded">{place}/</span>
            <span className="text-ink">new</span>
          </h1>
          <p className="mt-3 font-courier text-sm text-faded">
            Start a new community board in {placeRow.name ?? place}.
          </p>
        </header>

        <NewCommunityForm
          place={place}
          placeName={placeRow.name ?? place}
        />

        <footer className="mt-8 border-t border-rule pt-4 font-courier text-xs text-faded">
          <Link href={`/${place}`} className="text-link hover:underline">
            ← Back to {place}
          </Link>
        </footer>
      </main>
    </div>
  );
}

