"use server";

import { createClient } from "@/lib/supabase/server";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type SubmitCommunityState = {
  ok: boolean;
  error?: string;
  place?: string;
  slug?: string;
};

export async function submitCommunity(
  _prevState: SubmitCommunityState,
  formData: FormData
) {
  const place = (formData.get("place") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const yourName = (formData.get("your_name") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;

  if (!place || !name) {
    return { ok: false, error: "Place and community name are required." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: "Server configuration error. Try again later." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in to create a community." };
  }

  const slug = slugify(name);
  if (!slug) {
    return { ok: false, error: "Please choose a more descriptive name." };
  }

  const { data: placeRow, error: placeError } = await supabase
    .from("places")
    .select("slug")
    .eq("slug", place)
    .single();

  if (placeError || !placeRow) {
    return { ok: false, error: "Place not found." };
  }

  const { error: insertError } = await supabase.from("communities").insert({
    place_slug: place,
    slug,
    name,
    description,
    admin_email: email,
    is_active: true,
    created_by_id: user.id,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        ok: false,
        error: "That community already exists in this place.",
      };
    }
    return { ok: false, error: insertError.message };
  }

  return { ok: true, place, slug };
}

