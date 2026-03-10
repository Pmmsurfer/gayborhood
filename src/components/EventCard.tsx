"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitRsvp } from "@/actions/submitRsvp";

type Post = {
  id: string;
  title: string;
  category: string;
  body: string;
  author_name: string;
  neighborhood: string | null;
  event_date: string | null;
  event_time: string | null;
  max_attendees: number | null;
  house_rule: string | null;
  first_timers_welcome: boolean;
  rsvp_count: number;
  created_at: string;
};

function formatDate(d: string | null) {
  if (!d) return "";
  const date = new Date(d + "Z");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(t: string | null) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const am = hour < 12;
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${am ? "am" : "pm"}`;
}

function categoryLabel(cat: string) {
  const labels: Record<string, string> = {
    dinner: "Dinner",
    potluck: "Potluck",
    surf: "Surf",
    hiking: "Hiking",
    books: "Books",
    film: "Film",
    walk: "Walk",
    drinks: "Drinks",
    biking: "Biking",
    beach_day: "Beach Day",
    farmers_market: "Farmers Market",
    game_night: "Game Night",
    volunteer: "Volunteer",
  };
  return labels[cat] || cat;
}

export default function EventCard({ post }: { post: Post }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    formData.set("postId", post.id);
    setError(null);
    const result = await submitRsvp(formData);
    if (result.ok) {
      setSubmitted(true);
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  };

  const isFull =
    post.max_attendees != null && post.rsvp_count >= post.max_attendees;
  const isOpen = post.max_attendees == null;
  const noPhones =
    post.house_rule?.toLowerCase().includes("no phones") ?? false;
  const firstTimers = post.first_timers_welcome;

  return (
    <article className="border-b border-rule py-4 first:pt-0">
      <div className="flex gap-4">
        <div className="w-28 shrink-0 font-courier text-sm text-faded">
          <div>{formatDate(post.event_date)}</div>
          <div>{formatTime(post.event_time)}</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Link
              href={`/post/${post.id}`}
              className="font-courier font-bold text-link hover:underline"
            >
              {post.title}
            </Link>
            <span className="font-courier text-sm text-faded">
              {categoryLabel(post.category)}
            </span>
            {noPhones && (
              <span className="rounded-none border border-rule bg-paper px-1.5 py-0.5 font-courier text-xs text-faded">
                no phones
              </span>
            )}
            {firstTimers && (
              <span className="rounded-none border border-rule bg-paper px-1.5 py-0.5 font-courier text-xs text-faded">
                first-timers go first
              </span>
            )}
          </div>
          {post.neighborhood && (
            <p className="font-courier text-sm text-faded">
              {post.neighborhood}
              {post.body ? " · " : ""}
              {post.body}
            </p>
          )}
          {post.body && !post.neighborhood && (
            <p className="font-courier text-sm text-faded">{post.body}</p>
          )}
          {post.house_rule && (
            <p
              className="mt-1 font-courier text-sm italic text-brick"
              style={{ color: "var(--brick)" }}
            >
              {post.house_rule}
            </p>
          )}
          <p className="mt-1 font-courier text-sm text-faded">
            {post.rsvp_count} going
            {post.max_attendees != null
              ? ` · ${Math.max(0, post.max_attendees - post.rsvp_count)} spots left`
              : " · open · just come"}
          </p>

          {!submitted && !isFull && !isOpen && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSubmit(new FormData(e.currentTarget));
              }}
              className="mt-2 flex flex-wrap items-end gap-2"
            >
              <input type="hidden" name="postId" value={post.id} />
              <label className="flex flex-col font-courier text-sm">
                <span className="text-faded">Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-0.5 w-40 border-b border-ink bg-transparent font-courier"
                  placeholder="Your name"
                />
              </label>
              <button
                type="submit"
                className="btn font-bebas tracking-[3px]"
              >
                I&apos;M GOING
              </button>
            </form>
          )}
          {!submitted && isOpen && (
            <p className="mt-2 font-courier text-sm text-faded">
              open · just come
            </p>
          )}
          {submitted && (
            <p className="mt-2 font-courier text-sm text-faded">
              You&apos;re in. See you there.
            </p>
          )}
          {isFull && (
            <p className="mt-2 font-courier text-sm text-faded">full</p>
          )}
          {error && (
            <p className="mt-2 font-courier text-sm text-brick">{error}</p>
          )}
        </div>
      </div>
    </article>
  );
}
