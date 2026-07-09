// Creates (or promotes) the initial administrator account.
// Usage: node scripts/seed-admin.mjs
//
// Reads NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY from .env.local.
// Safe to run more than once — if the account already exists it just makes
// sure the profile role is 'admin'.
//
// Credentials (documented here per project request — change the password
// after first login if this repo is ever made public):
//   email:    admin@gmail.com
//   password: admin@gmail.com

import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin@gmail.com";
const ADMIN_FULL_NAME = "管理者";

function loadEnvLocal() {
  const path = new URL("../.env.local", import.meta.url);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] === undefined) {
      process.env[key] = rawValue.replace(/^"(.*)"$/, "$1");
    }
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  // admin.listUsers() is paginated; the project has few users so one page is enough.
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;
  return data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function main() {
  let user = await findUserByEmail(ADMIN_EMAIL);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_FULL_NAME },
      app_metadata: { role: "admin" },
    });
    if (error) throw error;
    user = data.user;
    console.log(`Created admin user ${ADMIN_EMAIL} (${user.id})`);
  } else {
    console.log(`Admin user ${ADMIN_EMAIL} already exists (${user.id}) — leaving password as-is`);
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: { role: "admin" },
    });
    if (error) throw error;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "admin", full_name: ADMIN_FULL_NAME })
    .eq("id", user.id);

  if (profileError) {
    console.warn(
      "Could not update profiles row (has migration 0002_users_and_avatars.sql been applied yet?):",
      profileError.message,
    );
  } else {
    console.log("profiles.role set to 'admin'.");
  }

  console.log("\nDone. Login at /admin/login with:");
  console.log(`  email:    ${ADMIN_EMAIL}`);
  console.log(`  password: ${ADMIN_PASSWORD}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
