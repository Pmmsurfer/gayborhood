"use server";

import { supabase } from "@/lib/supabase";

export async function submitRsvp(formData: FormData) {
  const postId = formData.get("postId") as string;
  const name = formData.get("name") as string;
  const neighborhood = (formData.get("neighborhood") as string) || null;
  const email = (formData.get("email") as string) || null;

  if (!postId || !name?.trim()) {
    return { ok: false, error: "Name is required." };
  }

  if (!supabase) return { ok: false, error: "Not configured." };

  const { data: post } = await supabase
    .from("posts")
    .select("gayborhood_slug, max_attendees, rsvp_count")
    .eq("id", postId)
    .single();

  if (!post) return { ok: false, error: "Event not found." };

  if (
    post.max_attendees != null &&
    post.rsvp_count >= post.max_attendees
  ) {
    return { ok: false, error: "This event is full." };
  }

  const { error } = await supabase.from("rsvps").insert({
    post_id: postId,
    gayborhood_slug: post.gayborhood_slug,
    name: name.trim(),
    neighborhood: neighborhood?.trim() || null,
    email: email?.trim() || null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
