"use server";

import { supabase } from "@/lib/supabase";

export async function submitReply(formData: FormData) {
  const postId = formData.get("postId") as string;
  const body = (formData.get("body") as string)?.trim();
  const authorName = (formData.get("author_name") as string)?.trim() || "anonymous";
  const neighborhood = (formData.get("neighborhood") as string)?.trim() || null;

  if (!postId || !body) {
    return { ok: false, error: "Reply text is required." };
  }

  if (!supabase) return { ok: false, error: "Not configured." };

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, gayborhood_slug, category")
    .eq("id", postId)
    .single();

  if (postError || !post) return { ok: false, error: "Post not found." };

  const isAnonymousThread =
    post.category === "missed_connection" || post.category === "anonymous";
  const finalAuthor = isAnonymousThread ? "anonymous" : authorName;

  const { error } = await supabase.from("replies").insert({
    post_id: postId,
    gayborhood_slug: post.gayborhood_slug,
    body,
    author_name: finalAuthor,
    neighborhood: isAnonymousThread ? null : neighborhood,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
