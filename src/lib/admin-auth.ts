import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Verifies the request carries a valid Supabase session cookie. Returns the user or null. */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
