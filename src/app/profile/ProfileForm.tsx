"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

type Props = {
  displayName: string;
};

export default function ProfileForm({ displayName }: Props) {
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in.");
      setLoading(false);
      return;
    }
    const { error: err } = await supabase
      .from("profiles")
      .update({
        display_name: name.trim() || "Anonymous",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-rule bg-paper px-2 py-1"
        />
        <p className="mt-1 text-xs text-faded">
          This name appears when you create communities and post.
        </p>
      </div>
      {error && <p className="text-brick">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn border border-ink bg-ink px-4 py-2 uppercase tracking-[1px] text-paper disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
