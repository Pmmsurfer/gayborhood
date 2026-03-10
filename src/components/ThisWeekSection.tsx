"use client";

import { useState, useMemo } from "react";
import EventCard from "./EventCard";

const FREE_EVENT_CATEGORIES = [
  "dinner",
  "potluck",
  "surf",
  "hiking",
  "books",
  "film",
  "walk",
  "drinks",
  "biking",
  "beach_day",
  "farmers_market",
  "game_night",
  "volunteer",
];

const CATEGORY_LABELS: Record<string, string> = {
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

export default function ThisWeekSection({ events }: { events: Post[] }) {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set()
  );

  const filtered = useMemo(() => {
    if (activeCategories.size === 0) return events;
    return events.filter((e) => activeCategories.has(e.category));
  }, [events, activeCategories]);

  const toggle = (cat: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <section id="this-week" className="mb-10">
      <h2 className="section-head font-bebas tracking-[2px] text-ink">
        THIS WEEK
      </h2>
      <div className="mb-3 flex flex-wrap gap-2">
        {FREE_EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => toggle(cat)}
            className={`border font-courier text-sm ${
              activeCategories.has(cat)
                ? "border-ink bg-ink text-paper"
                : "border-rule bg-paper text-ink"
            } px-2 py-1`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>
      <div className="space-y-0">
        {filtered.length === 0 ? (
          <p className="font-courier text-sm text-faded">
            No events this week. Post one!
          </p>
        ) : (
          filtered.map((post) => <EventCard key={post.id} post={post} />)
        )}
      </div>
    </section>
  );
}
