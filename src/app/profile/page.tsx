import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = {
  title: "Profile — Gayborhood",
  description: "Your profile and display name.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=" + encodeURIComponent("/profile"));
  }

  let displayName = "Anonymous";
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();
  if (profile?.display_name) displayName = profile.display_name;

  return (
    <div className="min-h-screen bg-paper">
      <main
        id="main-content"
        className="mx-auto max-w-board px-[18px] pb-12 pt-8"
      >
        <h1 className="font-bebas text-2xl tracking-[2px] text-ink">
          PROFILE
        </h1>
        <p className="mt-2 font-courier text-sm text-faded">
          Update how you appear on the board.
        </p>
        <div className="mt-8 max-w-sm">
          <ProfileForm displayName={displayName} />
        </div>
        <footer className="mt-8 border-t border-rule pt-4 font-courier text-xs text-faded">
          <Link href="/" className="text-link hover:underline">
            ← Home
          </Link>
        </footer>
      </main>
    </div>
  );
}
