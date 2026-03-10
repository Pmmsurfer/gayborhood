"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  ANONYMOUS_CATEGORIES,
  EVENT_CATEGORIES,
  PAID_EVENT_CATEGORIES,
} from "@/lib/categories";

export async function submitPost(formData: FormData) {
  const place = (formData.get("place") as string)?.trim();
  const community = (formData.get("community") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();
  const authorName = (formData.get("author_name") as string)?.trim() || "anonymous";
  const neighborhood = (formData.get("neighborhood") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;

  if (!place || !community || !category || !title || !body) {
    return {
      ok: false,
      error: "Place, community, category, title, and body are required.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in to post." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name?.trim() || authorName;

  const isAnonymous = ANONYMOUS_CATEGORIES.includes(category as (typeof ANONYMOUS_CATEGORIES)[number]);
  const isEvent = EVENT_CATEGORIES.includes(category as (typeof EVENT_CATEGORIES)[number]);
  const isPaidEvent = PAID_EVENT_CATEGORIES.includes(category as (typeof PAID_EVENT_CATEGORIES)[number]);

  const row: Record<string, unknown> = {
    place_slug: place,
    community_slug: community,
    category,
    title,
    body,
    author_name: isAnonymous ? "anonymous" : displayName,
    author_id: user.id,
    neighborhood: isAnonymous ? null : neighborhood,
    email: isAnonymous ? null : email,
  };

  if (isEvent) {
    const eventDate = (formData.get("event_date") as string)?.trim() || null;
    const eventTime = (formData.get("event_time") as string)?.trim() || null;
    const maxAttendeesRaw = (formData.get("max_attendees") as string)?.trim();
    const maxAttendees = maxAttendeesRaw ? parseInt(maxAttendeesRaw, 10) : null;
    const houseRule = (formData.get("house_rule") as string)?.trim() || null;
    const firstTimersWelcome = formData.get("first_timers_welcome") === "on";

    row.event_date = eventDate || null;
    row.event_time = eventTime || null;
    row.max_attendees = Number.isFinite(maxAttendees) ? maxAttendees : null;
    row.house_rule = houseRule;
    row.first_timers_welcome = firstTimersWelcome;
  }

  if (isPaidEvent) {
    const priceCentsRaw = (formData.get("price_cents") as string)?.trim();
    const priceCents = priceCentsRaw ? Math.round(parseFloat(priceCentsRaw) * 100) : null;
    const paymentLink = (formData.get("payment_link") as string)?.trim() || null;
    row.price_cents = Number.isFinite(priceCents) && priceCents != null ? priceCents : null;
    row.payment_link = paymentLink;
  }

  const { data, error } = await supabase
    .from("posts")
    .insert(row)
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  if (!data?.id) return { ok: false, error: "Post created but no ID returned." };

  revalidatePath(`/${place}/${community}`);
  revalidatePath(`/post/${data.id}`);

  return { ok: true, id: data.id };
}
