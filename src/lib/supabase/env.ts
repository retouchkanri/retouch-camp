// NOTE: Next.js/Turbopack only inlines NEXT_PUBLIC_* vars into the client bundle
// when they're accessed as a static `process.env.NEXT_PUBLIC_X` expression — a
// dynamic `process.env[name]` lookup is NOT replaced and evaluates to `undefined`
// in the browser. Keep these as literal, non-computed property accesses.

function clean(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function rawSupabaseUrl(): string | undefined {
  return clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function rawSupabaseAnonKey(): string | undefined {
  return clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function rawSupabaseServiceRoleKey(): string | undefined {
  return clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isSupabaseConfigured(): boolean {
  return isValidHttpUrl(rawSupabaseUrl()) && !!rawSupabaseAnonKey();
}

export function isSupabaseAdminConfigured(): boolean {
  return isSupabaseConfigured() && !!rawSupabaseServiceRoleKey();
}

export function getSupabaseUrl(): string {
  const url = rawSupabaseUrl();
  if (!isValidHttpUrl(url)) {
    throw new Error(
      "Missing or invalid NEXT_PUBLIC_SUPABASE_URL. Set a valid https:// URL in your environment variables.",
    );
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = rawSupabaseAnonKey();
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Set it in your environment variables.",
    );
  }
  return key;
}

export function getSupabaseServiceRoleKey(): string {
  const key = rawSupabaseServiceRoleKey();
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Set it in your environment variables.",
    );
  }
  return key;
}
