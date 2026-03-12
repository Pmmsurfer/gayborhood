"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitPost } from "@/actions/submitPost";
import {
  CATEGORY_GROUPS,
  EVENT_VALUES_SET,
  PAID_EVENT_VALUES_SET,
  ANON_VALUES_SET,
} from "@/lib/categories";

type Gayborhood = { slug: string; name: string; is_active: boolean };

type Props = {
  gayborhoods: Gayborhood[];
  defaultSlug: string | null;
};

export default function SubmitForm({ gayborhoods, defaultSlug }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState("");

  const isEvent = EVENT_VALUES_SET.has(category);
  const isPaidEvent = PAID_EVENT_VALUES_SET.has(category);
  const hideName = ANON_VALUES_SET.has(category);
  const activeGayborhoods = gayborhoods.filter((g) => g.is_active);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const result = await submitPost(formData);
      if (result.ok && result.id) {
        router.push(`/post/${result.id}`);
        return;
      }
      setError(result?.error ?? "Something went wrong.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="gayborhood_slug" className="mb-1 block font-courier text-sm font-bold text-ink">
          Post to
        </label>
        <select
          id="gayborhood_slug"
          name="gayborhood_slug"
          required
          defaultValue={defaultSlug ?? ""}
          className="w-full max-w-md border-b border-ink bg-transparent font-courier"
        >
          <option value="">Choose a city</option>
          {activeGayborhoods.map((g) => (
            <option key={g.slug} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block font-courier text-sm font-bold text-ink">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full max-w-md border-b border-ink bg-transparent font-courier"
        >
          <option value="">Choose a category</option>
          {CATEGORY_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="mb-1 block font-courier text-sm font-bold text-ink">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full border-b border-ink bg-transparent font-courier"
        />
      </div>

      <div>
        <label htmlFor="body" className="mb-1 block font-courier text-sm font-bold text-ink">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={6}
          className="w-full border-b border-ink bg-transparent font-courier"
        />
      </div>

      {!hideName && (
        <div>
          <label htmlFor="author_name" className="mb-1 block font-courier text-sm font-bold text-ink">
            Your name
          </label>
          <input
            id="author_name"
            name="author_name"
            type="text"
            required
            className="w-full max-w-md border-b border-ink bg-transparent font-courier"
          />
        </div>
      )}

      <div>
        <label htmlFor="neighborhood" className="mb-1 block font-courier text-sm font-bold text-ink">
          Neighborhood {!hideName && "(optional)"}
        </label>
        <input
          id="neighborhood"
          name="neighborhood"
          type="text"
          className="w-full max-w-md border-b border-ink bg-transparent font-courier"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block font-courier text-sm text-faded">
          Email (optional — not shown publicly)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full max-w-md border-b border-ink bg-transparent font-courier"
        />
      </div>

      {isEvent && (
        <>
          <hr className="border-rule" />
          <p className="font-bebas text-sm tracking-[2px] text-ink">EVENT DETAILS</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="event_date" className="mb-1 block font-courier text-sm text-ink">
                Date
              </label>
              <input
                id="event_date"
                name="event_date"
                type="date"
                className="w-full border-b border-ink bg-transparent font-courier"
              />
            </div>
            <div>
              <label htmlFor="event_time" className="mb-1 block font-courier text-sm text-ink">
                Time
              </label>
              <input
                id="event_time"
                name="event_time"
                type="time"
                className="w-full border-b border-ink bg-transparent font-courier"
              />
            </div>
          </div>
          <div>
            <label htmlFor="max_attendees" className="mb-1 block font-courier text-sm text-faded">
              Max attendees (optional — leave blank for open)
            </label>
            <input
              id="max_attendees"
              name="max_attendees"
              type="number"
              min={1}
              className="w-24 border-b border-ink bg-transparent font-courier"
            />
          </div>
          <div>
            <label htmlFor="house_rule" className="mb-1 block font-courier text-sm text-faded">
              House rule (optional — e.g. &quot;no phones&quot;)
            </label>
            <input
              id="house_rule"
              name="house_rule"
              type="text"
              className="w-full max-w-md border-b border-ink bg-transparent font-courier"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="first_timers_welcome"
              name="first_timers_welcome"
              type="checkbox"
              className="border-ink"
            />
            <label htmlFor="first_timers_welcome" className="font-courier text-sm text-ink">
              First-timers go first
            </label>
          </div>
        </>
      )}

      {isPaidEvent && (
        <>
          <hr className="border-rule" />
          <p className="font-bebas text-sm tracking-[2px] text-ink">PAID EVENT</p>
          <div>
            <label htmlFor="price_cents" className="mb-1 block font-courier text-sm text-ink">
              Price per person ($)
            </label>
            <input
              id="price_cents"
              name="price_cents"
              type="number"
              step="0.01"
              min={0}
              placeholder="e.g. 65"
              className="w-24 border-b border-ink bg-transparent font-courier"
            />
          </div>
          <div>
            <label htmlFor="payment_link" className="mb-1 block font-courier text-sm text-faded">
              Payment link (Venmo, Stripe, etc.)
            </label>
            <input
              id="payment_link"
              name="payment_link"
              type="url"
              placeholder="https://..."
              className="w-full max-w-md border-b border-ink bg-transparent font-courier"
            />
          </div>
        </>
      )}

      {error && <p className="font-courier text-sm text-brick">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn font-bebas tracking-[3px] disabled:opacity-50"
      >
        {submitting ? "Posting…" : "POST"}
      </button>
    </form>
  );
}
