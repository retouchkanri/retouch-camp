import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import type { BookingWithRelations, ExperienceOption, SiteType } from "@/types/database";

export const DEFAULT_MAX_GROUPS_PER_DAY = 4;

export async function getMaxGroupsPerDay(): Promise<number> {
  if (!isSupabaseAdminConfigured()) return DEFAULT_MAX_GROUPS_PER_DAY;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "max_groups_per_day")
    .single();
  const value = data?.value;
  return typeof value === "number" ? value : DEFAULT_MAX_GROUPS_PER_DAY;
}

export async function countActiveBookingsForDate(date: string): Promise<number> {
  if (!isSupabaseAdminConfigured()) return 0;
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("stay_date", date)
    .in("status", ["pending", "approved"]);
  return count ?? 0;
}

export async function getAvailabilityForDate(date: string) {
  const [max, used] = await Promise.all([getMaxGroupsPerDay(), countActiveBookingsForDate(date)]);
  return { date, max, used, remaining: Math.max(0, max - used) };
}

export async function getActiveSiteTypes(): Promise<SiteType[]> {
  if (!isSupabaseAdminConfigured()) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_types")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  return (data as SiteType[]) ?? [];
}

export async function getActiveExperienceOptions(): Promise<ExperienceOption[]> {
  if (!isSupabaseAdminConfigured()) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("experience_options")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  return (data as ExperienceOption[]) ?? [];
}

export function computeOptionQuantity(
  option: ExperienceOption,
  numAdults: number,
  numChildren: number,
): number {
  return option.unit === "per_person" ? Math.max(1, numAdults + numChildren) : 1;
}

export async function listBookings(filters: { status?: string } = {}): Promise<BookingWithRelations[]> {
  if (!isSupabaseAdminConfigured()) return [];
  const supabase = createAdminClient();
  let query = supabase
    .from("bookings")
    .select("*, site_type:site_types(*)")
    .order("stay_date", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);

  const { data } = await query;
  return (data as BookingWithRelations[]) ?? [];
}

export async function getBookingsInRange(start: string, end: string): Promise<BookingWithRelations[]> {
  if (!isSupabaseAdminConfigured()) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, site_type:site_types(*)")
    .gte("stay_date", start)
    .lt("stay_date", end)
    .neq("status", "cancelled")
    .order("stay_date");
  return (data as BookingWithRelations[]) ?? [];
}

export async function getBookingById(id: string): Promise<BookingWithRelations | null> {
  if (!isSupabaseAdminConfigured()) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, site_type:site_types(*), booking_options(*, experience_option:experience_options(*))")
    .eq("id", id)
    .single();
  return (data as BookingWithRelations) ?? null;
}

export async function getBookingByCancelToken(
  token: string,
): Promise<BookingWithRelations | null> {
  if (!isSupabaseAdminConfigured()) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, site_type:site_types(*), booking_options(*, experience_option:experience_options(*))")
    .eq("cancel_token", token)
    .single();
  return (data as BookingWithRelations) ?? null;
}

export function computeTotalPrice(
  siteType: SiteType,
  nights: number,
  selectedOptions: ExperienceOption[],
  numAdults: number,
  numChildren: number,
): number {
  const siteTotal = siteType.price_per_night * nights;
  const optionsTotal = selectedOptions.reduce(
    (sum, opt) => sum + opt.price * computeOptionQuantity(opt, numAdults, numChildren),
    0,
  );
  return siteTotal + optionsTotal;
}
