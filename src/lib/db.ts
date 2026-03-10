import { cache } from "react";
import { supabase } from "./supabase";
import {
  BOARD_EXCLUDE_IN,
  CLASSIFIED_CATEGORIES,
} from "./categories";

const LIST_LIMIT = 100;

export async function getGayborhood(slug: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("gayborhoods")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getAllGayborhoods() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("gayborhoods")
    .select("*")
    .order("is_active", { ascending: false });
  if (error) return [];
  return data;
}

/** Future free events for This Week, sorted by event_date asc (excludes paid) */
export async function getThisWeekEvents(gayborhoodSlug: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("gayborhood_slug", gayborhoodSlug)
    .eq("is_approved", true)
    .not("event_date", "is", null)
    .gte("event_date", new Date().toISOString().slice(0, 10))
    .or("price_cents.is.null,price_cents.eq.0")
    .order("event_date", { ascending: true })
    .limit(LIST_LIMIT);
  if (error) return [];
  return data;
}

/** Board posts (newest first), excluding events and classifieds — slim select for cards */
export async function getBoardPosts(gayborhoodSlug: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, category, author_name, neighborhood, created_at, reply_count, like_count")
    .eq("gayborhood_slug", gayborhoodSlug)
    .eq("is_approved", true)
    .is("event_date", null)
    .not("category", "in", BOARD_EXCLUDE_IN)
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);
  if (error) return [];
  return data;
}

export async function getMissedConnections(gayborhoodSlug: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, created_at, reply_count, like_count")
    .eq("gayborhood_slug", gayborhoodSlug)
    .eq("category", "missed_connection")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);
  if (error) return [];
  return data;
}

export async function getAnonymousPosts(gayborhoodSlug: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, created_at, reply_count, like_count")
    .eq("gayborhood_slug", gayborhoodSlug)
    .eq("category", "anonymous")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);
  if (error) return [];
  return data;
}

export async function getClassifieds(gayborhoodSlug: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, category, created_at")
    .eq("gayborhood_slug", gayborhoodSlug)
    .eq("is_approved", true)
    .in("category", [...CLASSIFIED_CATEGORIES])
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);
  if (error) return [];
  return data;
}

/** Paid events only (price_cents > 0) — slim select for cards */
export async function getHostedExperiences(gayborhoodSlug: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, category, event_date, price_cents, rsvp_count")
    .eq("gayborhood_slug", gayborhoodSlug)
    .eq("is_approved", true)
    .gt("price_cents", 0)
    .order("event_date", { ascending: true })
    .limit(LIST_LIMIT);
  if (error) return [];
  return data;
}

export async function getRecommendations(gayborhoodSlug: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, category, body, like_count")
    .eq("gayborhood_slug", gayborhoodSlug)
    .eq("category", "recommendation")
    .eq("is_approved", true)
    .order("like_count", { ascending: false })
    .limit(LIST_LIMIT);
  if (error) return [];
  return data;
}

/** Single post by id (for thread view). Cached per request so metadata + page share one fetch. */
export const getPostById = cache(async function getPostById(id: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("is_approved", true)
    .single();
  if (error) return null;
  return data;
});

/** Replies for a post, oldest first (for thread view) */
export async function getRepliesByPostId(postId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("replies")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) return [];
  return data;
}

/** RSVPs for an event (for thread view — first N for display) */
export async function getRsvpsByPostId(postId: string, limit = 10) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("rsvps")
    .select("name, neighborhood")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) return [];
  return data;
}

export async function getPostCounts(gayborhoodSlug: string) {
  if (!supabase) {
    return {
      thisWeek: 0,
      board: 0,
      missedConnections: 0,
      anonymous: 0,
      classifieds: 0,
      hosted: 0,
      recs: 0,
    };
  }
  const today = new Date().toISOString().slice(0, 10);
  const [events, board, missed, anon, classifieds, hosted, recs] =
    await Promise.all([
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("gayborhood_slug", gayborhoodSlug)
        .eq("is_approved", true)
        .not("event_date", "is", null)
        .gte("event_date", today),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("gayborhood_slug", gayborhoodSlug)
        .eq("is_approved", true)
        .is("event_date", null)
        .not("category", "in", BOARD_EXCLUDE_IN),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("gayborhood_slug", gayborhoodSlug)
        .eq("category", "missed_connection")
        .eq("is_approved", true),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("gayborhood_slug", gayborhoodSlug)
        .eq("category", "anonymous")
        .eq("is_approved", true),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("gayborhood_slug", gayborhoodSlug)
        .eq("is_approved", true)
        .in("category", [...CLASSIFIED_CATEGORIES]),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("gayborhood_slug", gayborhoodSlug)
        .eq("is_approved", true)
        .gt("price_cents", 0),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("gayborhood_slug", gayborhoodSlug)
        .eq("category", "recommendation")
        .eq("is_approved", true),
    ]);

  return {
    thisWeek: events.count ?? 0,
    board: board.count ?? 0,
    missedConnections: missed.count ?? 0,
    anonymous: anon.count ?? 0,
    classifieds: classifieds.count ?? 0,
    hosted: hosted.count ?? 0,
    recs: recs.count ?? 0,
  };
}
