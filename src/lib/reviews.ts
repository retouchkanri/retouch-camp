import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Review } from "@/types/database";

export async function listAllReviews(): Promise<Review[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
  return (data as Review[]) ?? [];
}
