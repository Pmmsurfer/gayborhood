"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isPowerUser } from "@/lib/powerUser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function deleteCommunity(placeSlug: string, communitySlug: string) {
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: "Server configuration error. Try again later." };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return { ok: false, error: "You must be signed in." };
  }
  if (!isPowerUser(user.email)) {
    return { ok: false, error: "Only power users can delete communities." };
  }
  if (!supabaseAdmin) {
    return { ok: false, error: "Server not configured for delete." };
  }

  // Delete posts in this community first (no FK cascade from communities to posts)
  const { error: postsErr } = await supabaseAdmin
    .from("posts")
    .delete()
    .eq("place_slug", placeSlug)
    .eq("community_slug", communitySlug);
  if (postsErr) {
    return { ok: false, error: postsErr.message };
  }

  const { error: communityErr } = await supabaseAdmin
    .from("communities")
    .delete()
    .eq("place_slug", placeSlug)
    .eq("slug", communitySlug);
  if (communityErr) {
    return { ok: false, error: communityErr.message };
  }

  revalidatePath(`/${placeSlug}`);
  return { ok: true };
}
