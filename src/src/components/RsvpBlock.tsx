"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitRsvp } from "@/actions/submitRsvp";

type Post = {
  id: string;
  title: string;
  max_attendees: number | null;
  rsvp_count: number;
  price_cents: number | null;
  payment_link: string | null;
};

type RsvpAttendee = { name: string; neighborhood: string | null };

const DISPLAY_NAMES = 4;

export default function RsvpBlock({
  post,
  attendees,
}: {
  post: Post;
  attendees: RsvpAttendee[];
}) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFull = post.max_attendees != null && post.rsvp_count >= post.max_attendees;
  const isOpen = post.max_attendees == null;
  const spotsLeft =
    post.max_attendees != null ? Math.max(0, post.max_attendees - post.rsvp_count) : null;
  const isPaid = post.price_cents != null && post.price_cents > 0;
  const priceStr = isPaid && post.price_cents != null ? `$${Math.round(post.price_cents / 100)}` : null;

  const displayAttendees = attendees.slice(0, DISPLAY_NAMES);
  const otherCount = attendees.length > DISPLAY_NAMES ? attendees.length - DISPLAY_NAMES : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("postId", post.id);
    const result = await submitRsvp(formData);
    if (result.ok) {
      setSubmitted(true);
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="border border-rule bg-paper p-4">
      <h3 className="font-bebas mb-2 text-lg tracking-[2px] text-ink">
        GOING ({post.rsvp_count}
        {post.max_attendees != null ? ` / ${post.max_attendees}` : ""})
      </h3>

      {isPaid && priceStr && (
        <p className="mb-3 font-courier text-sm text-ink">
          <span className="font-bold">{priceStr} per person</span>
          {post.payment_link && (
            <>
              {" · "}
              <a
                href={post.payment_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link hover:underline"
              >
                Pay here (Venmo / Stripe / etc.)
              </a>
            </>
          )}
        </p>
      )}

      {attendees.length > 0 && (
        <p className="mb-3 font-courier text-sm text-faded">
          {displayAttendees.map((a) => a.name).join(", ")}
          {otherCount > 0 && ` and ${otherCount} other${otherCount === 1 ? "" : "s"}`}
        </p>
      )}

      {submitted ? (
        <p className="font-courier text-sm text-faded">You&apos;re in. See you there.</p>
      ) : !isFull && !isOpen ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="hidden" name="postId" value={post.id} />
          <div>
            <label htmlFor="rsvp-name" className="mb-1 block font-courier text-sm text-ink">
              Name
            </label>
            <input
              id="rsvp-name"
              type="text"
              name="name"
              required
              className="w-full max-w-xs border-b border-ink bg-transparent font-courier"
            />
          </div>
          <div>
            <label htmlFor="rsvp-neighborhood" className="mb-1 block font-courier text-sm text-ink">
              Neighborhood (optional)
            </label>
            <input
              id="rsvp-neighborhood"
              type="text"
              name="neighborhood"
              className="w-full max-w-xs border-b border-ink bg-transparent font-courier"
            />
          </div>
          <button type="submit" className="btn font-bebas tracking-[3px]">
            I&apos;M GOING
          </button>
          {error && <p className="font-courier text-sm text-brick">{error}</p>}
        </form>
      ) : isFull ? (
        <p className="font-courier text-sm text-faded">This event is full.</p>
      ) : (
        <p className="font-courier text-sm text-faded">Open · just come.</p>
      )}
    </div>
  );
}
