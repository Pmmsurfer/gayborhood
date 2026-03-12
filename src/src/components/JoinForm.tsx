"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitSubscriber } from "@/actions/submitSubscriber";

export default function JoinForm({
  gayborhoodSlug,
}: {
  gayborhoodSlug: string;
}) {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("gayborhood_slug", gayborhoodSlug);
    const result = await submitSubscriber(formData);
    if (result.ok) {
      setDone(true);
      form.reset();
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  }

  if (done) {
    return (
      <p className="font-courier text-sm text-faded">
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="gayborhood_slug" value={gayborhoodSlug} />
      <div>
        <label htmlFor="join-name" className="mb-1 block font-courier text-sm text-ink">
          Name
        </label>
        <input
          id="join-name"
          type="text"
          name="name"
          className="w-full border-b border-ink bg-transparent font-courier"
        />
      </div>
      <div>
        <label htmlFor="join-email" className="mb-1 block font-courier text-sm text-ink">
          Email
        </label>
        <input
          id="join-email"
          type="email"
          name="email"
          required
          className="w-full border-b border-ink bg-transparent font-courier"
        />
      </div>
      <div>
        <label htmlFor="join-neighborhood" className="mb-1 block font-courier text-sm text-ink">
          Neighborhood
        </label>
        <input
          id="join-neighborhood"
          type="text"
          name="neighborhood"
          className="w-full border-b border-ink bg-transparent font-courier"
        />
      </div>
      <button type="submit" className="btn font-bebas tracking-[3px]">
        JOIN
      </button>
      {error && <p className="font-courier text-sm text-brick">{error}</p>}
    </form>
  );
}
