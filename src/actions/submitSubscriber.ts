"use server";

import { supabase } from "@/lib/supabase";

export async function submitSubscriber(formData: FormData) {
  const email = formData.get("email") as string;
  const name = (formData.get("name") as string) || null;
  const neighborhood = (formData.get("neighborhood") as string) || null;
  const gayborhoodSlug = (formData.get("gayborhood_slug") as string) || null;

  if (!email?.trim()) {
    return { ok: false, error: "Email is required." };
  }

  if (!supabase) return { ok: false, error: "Not configured." };

  const { error } = await supabase.from("subscribers").upsert(
    {
      email: email.trim().toLowerCase(),
      name: name?.trim() || null,
      neighborhood: neighborhood?.trim() || null,
      gayborhood_slug: gayborhoodSlug || null,
    },
    { onConflict: "email" }
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
