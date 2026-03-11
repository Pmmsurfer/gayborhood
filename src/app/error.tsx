"use client";

import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-board px-[18px] py-12 font-courier text-sm">
      <p className="text-ink">Something went wrong.</p>
      <p className="mt-2 text-faded">
        If this keeps happening, check your Vercel project env vars:{" "}
        <code className="bg-rule px-1">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="bg-rule px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,{" "}
        <code className="bg-rule px-1">SUPABASE_SERVICE_ROLE_KEY</code>.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="border border-ink bg-ink px-4 py-2 text-paper hover:opacity-90"
        >
          Try again
        </button>
        <Link href="/" className="border border-rule px-4 py-2 text-ink hover:underline">
          ← Home
        </Link>
      </div>
    </div>
  );
}
