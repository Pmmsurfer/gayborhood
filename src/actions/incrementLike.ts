"use server";

import { supabase } from "@/lib/supabase";

export async function incrementLike(targetTable: "posts" | "replies", rowId: string) {
  if (!supabase) return { ok: false, error: "Not configured." };
  const { error } = await supabase.rpc("increment_like", {
    target_table: targetTable,
    row_id: rowId,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
