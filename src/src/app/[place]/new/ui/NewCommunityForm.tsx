"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import {
  submitCommunity,
  type SubmitCommunityState,
} from "@/actions/submitCommunity";

export function NewCommunityForm({
  place,
  placeName,
}: {
  place: string;
  placeName: string;
}) {
  const initialState: SubmitCommunityState = { ok: false };
  const router = useRouter();
  const [state, formAction] = useFormState<SubmitCommunityState, FormData>(
    submitCommunity,
    initialState
  );

  useEffect(() => {
    if (state.ok && state.place && state.slug) {
      router.push(`/${state.place}/${state.slug}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4 font-courier text-sm">
      <input type="hidden" name="place" value={place} />

      <div>
        <label className="mb-1 block text-ink">
          Community name
          <input
            name="name"
            required
            className="mt-1 block w-full border border-rule bg-paper px-2 py-1"
            placeholder="eg. Gayborhood, Queer Climbers, Trans Makers"
          />
        </label>
      </div>

      <div>
        <label className="mb-1 block text-ink">
          Description
          <textarea
            name="description"
            rows={4}
            className="mt-1 block w-full border border-rule bg-paper px-2 py-1"
            placeholder={`What is this community about? Who is it for in ${placeName}?`}
          />
        </label>
      </div>

      <div>
        <label className="mb-1 block text-ink">
          Your name
          <input
            name="your_name"
            className="mt-1 block w-full border border-rule bg-paper px-2 py-1"
            placeholder="Optional"
          />
        </label>
      </div>

      <div>
        <label className="mb-1 block text-ink">
          Email
          <input
            name="email"
            type="email"
            className="mt-1 block w-full border border-rule bg-paper px-2 py-1"
            placeholder="Optional — for admin contact"
          />
        </label>
      </div>

      {state.error && (
        <p className="text-xs text-brick">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        className="btn border border-ink bg-ink px-4 py-2 font-courier text-sm uppercase tracking-[1px] text-paper"
      >
        Create community
      </button>

      <p className="text-xs text-faded">
        By creating a community you agree to our house rules.
      </p>
    </form>
  );
}

