import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/types/database";

export async function listAllProfiles(): Promise<Profile[]> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  return (data as Profile[]) ?? [];
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
  return (data as Profile) ?? null;
}
