"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/profile";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName.trim() || "Anonymous" },
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-courier text-sm">
      <div>
        <label htmlFor="display_name" className="mb-1 block font-bold text-ink">
          Display name
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How you'll appear on posts"
          className="w-full border border-rule bg-paper px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block font-bold text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-rule bg-paper px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block font-bold text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-rule bg-paper px-2 py-1"
        />
        <p className="mt-1 text-xs text-faded">At least 6 characters</p>
      </div>
      {error && <p className="text-brick">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn border border-ink bg-ink px-4 py-2 uppercase tracking-[1px] text-paper disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p className="text-faded">
        Already have an account?{" "}
        <Link
          href={
            next !== "/profile"
              ? `/login?next=${encodeURIComponent(next)}`
              : "/login"
          }
          className="text-link hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
