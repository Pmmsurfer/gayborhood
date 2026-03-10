"use client";

import Link from "next/link";

export default function ThreadError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-board px-[18px] py-12 text-center">
      <p className="font-courier text-sm text-ink">Something went wrong loading this post.</p>
      <p className="mt-2 font-courier text-sm text-faded">{error.message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="btn font-bebas tracking-[3px]"
        >
          Try again
        </button>
        <Link href="/la-westside" className="btn font-bebas tracking-[3px]">
          Back to board
        </Link>
      </div>
    </div>
  );
}
