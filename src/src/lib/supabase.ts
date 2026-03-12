import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type Gayborhood = {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string | null;
  tagline: string | null;
  est_year: number;
  is_active: boolean;
  member_count: number;
  created_at: string;
};

export type Post = {
  id: string;
  place_slug: string;
  community_slug: string;
  category: string;
  title: string;
  body: string;
  author_name: string;
  neighborhood: string | null;
  email: string | null;
  event_date: string | null;
  event_time: string | null;
  max_attendees: number | null;
  house_rule: string | null;
  first_timers_welcome: boolean;
  price_cents: number | null;
  payment_link: string | null;
  like_count: number;
  reply_count: number;
  rsvp_count: number;
  created_at: string;
  is_approved: boolean;
};

export type Reply = {
  id: string;
  post_id: string;
  place_slug: string | null;
  community_slug: string | null;
  body: string;
  author_name: string;
  neighborhood: string | null;
  like_count: number;
  created_at: string;
};

export type Rsvp = {
  id: string;
  post_id: string;
  name: string;
  neighborhood: string | null;
  email: string | null;
  is_first_timer: boolean;
  created_at: string;
};
