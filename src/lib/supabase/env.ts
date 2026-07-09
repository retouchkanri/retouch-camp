function readEnv(name: string): string | undefined {
  const value = process.env[name];
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

export function isSupabaseConfigured(): boolean {
  return (
    isValidHttpUrl(readEnv("NEXT_PUBLIC_SUPABASE_URL")) &&
    !!readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return isSupabaseConfigured() && !!readEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getSupabaseUrl(): string {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  if (!isValidHttpUrl(url)) {
    throw new Error(
      "Missing or invalid NEXT_PUBLIC_SUPABASE_URL. Set a valid https:// URL in your environment variables.",
    );
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Set it in your environment variables.",
    );
  }
  return key;
}

export function getSupabaseServiceRoleKey(): string {
  const key = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Set it in your environment variables.",
    );
  }
  return key;
}
