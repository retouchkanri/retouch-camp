import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingWithRelations, Profile } from "@/types/database";

/** The logged-in user's own profile, read via the request-scoped (RLS-checked) client. */
export async function getCurrentProfile(): Promise<{ userId: string; profile: Profile } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return null;

  return { userId: user.id, profile: profile as Profile };
}

export async function getBookingsForUser(userId: string, email: string): Promise<BookingWithRelations[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, site_type:site_types(*)")
    .or(`user_id.eq.${userId},customer_email.eq.${email}`)
    .order("stay_date", { ascending: false });
  return (data as BookingWithRelations[]) ?? [];
}
