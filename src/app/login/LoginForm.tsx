"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-rule bg-paper px-2 py-1"
        />
      </div>
      {error && <p className="text-brick">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn border border-ink bg-ink px-4 py-2 uppercase tracking-[1px] text-paper disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-faded">
        No account?{" "}
        <Link
          href={
            next !== "/"
              ? `/signup?next=${encodeURIComponent(next)}`
              : "/signup"
          }
          className="text-link hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
