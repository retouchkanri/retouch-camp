import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import type { Profile, UserRole } from "@/types/database";

export type AdminUserRecord = Profile & {
  email_confirmed: boolean;
  banned: boolean;
  last_sign_in_at: string | null;
};

function mergeAuthFields(profile: Profile, authUser?: {
  email?: string;
  email_confirmed_at?: string | null;
  banned_until?: string | null;
  last_sign_in_at?: string | null;
}): AdminUserRecord {
  const banned =
    !!authUser?.banned_until && new Date(authUser.banned_until) > new Date();

  return {
    ...profile,
    email: profile.email ?? authUser?.email ?? null,
    email_confirmed: !!authUser?.email_confirmed_at,
    banned,
    last_sign_in_at: authUser?.last_sign_in_at ?? null,
  };
}

async function fetchAuthUsersById() {
  if (!isSupabaseAdminConfigured()) return new Map();
  const supabase = createAdminClient();
  const authById = new Map<
    string,
    {
      email?: string;
      email_confirmed_at?: string | null;
      banned_until?: string | null;
      last_sign_in_at?: string | null;
    }
  >();

  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error || !data.users.length) break;

    for (const user of data.users) {
      authById.set(user.id, {
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        banned_until: user.banned_until,
        last_sign_in_at: user.last_sign_in_at,
      });
    }

    if (data.users.length < perPage) break;
    page += 1;
  }

  return authById;
}

export async function listAllAdminUsers(role?: UserRole): Promise<AdminUserRecord[]> {
  if (!isSupabaseAdminConfigured()) return [];
  const supabase = createAdminClient();
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });

  if (role) {
    query = query.eq("role", role);
  }

  const [{ data: profiles }, authById] = await Promise.all([query, fetchAuthUsersById()]);

  return ((profiles as Profile[]) ?? []).map((profile) =>
    mergeAuthFields(profile, authById.get(profile.id)),
  );
}

export async function getAdminUserById(id: string): Promise<AdminUserRecord | null> {
  if (!isSupabaseAdminConfigured()) return null;
  const supabase = createAdminClient();
  const [{ data: profile }, { data: authData, error }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase.auth.admin.getUserById(id),
  ]);

  if (!profile || error) return null;

  const authUser = authData.user;
  return mergeAuthFields(profile as Profile, authUser ?? undefined);
}
