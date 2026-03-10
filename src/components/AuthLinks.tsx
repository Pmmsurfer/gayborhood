"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type Props = { signedIn: boolean };

export default function AuthLinks({ signedIn }: Props) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (signedIn) {
    return (
      <span className="flex items-center gap-x-4 font-courier text-xs text-faded">
        <Link href="/profile" className="text-link hover:underline">
          Profile
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="border-none bg-transparent p-0 text-link hover:underline"
        >
          Sign out
        </button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-x-4 font-courier text-xs text-faded">
      <Link href="/login" className="text-link hover:underline">
        Sign in
      </Link>
      <Link href="/login/sign-up" className="text-link hover:underline">
        Sign up
      </Link>
    </span>
  );
}
