import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import type { BookingWithRelations, ExperienceOption, SiteType } from "@/types/database";

export const DEFAULT_MAX_GROUPS_PER_DAY = 4;

const ACTIVE_STATUSES = ["pending", "approved"];
// How far back a stay could start and still overlap a target date. Nights are
// capped at 3 in the form/API; 30 leaves ample headroom if that cap grows.
const MAX_STAY_LOOKBACK_DAYS = 30;

function addDaysISO(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

type ActiveStay = { stay_date: string; nights: number };

async function fetchActiveStaysAround(rangeStart: string, rangeEnd: string): Promise<ActiveStay[]> {
  if (!isSupabaseAdminConfigured()) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bookings")
    .select("stay_date, nights")
    .in("status", ACTIVE_STATUSES)
    .gte("stay_date", addDaysISO(rangeStart, -MAX_STAY_LOOKBACK_DAYS))
    .lte("stay_date", rangeEnd);
  return (data as ActiveStay[]) ?? [];
}

function countStaysOverlapping(stays: ActiveStay[], date: string): number {
  return stays.filter(
    (s) => s.stay_date <= date && addDaysISO(s.stay_date, Math.max(1, s.nights)) > date,
  ).length;
}

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
  const stays = await fetchActiveStaysAround(date, date);
  return countStaysOverlapping(stays, date);
}

export async function getAvailabilityForDate(date: string) {
  const [max, used] = await Promise.all([getMaxGroupsPerDay(), countActiveBookingsForDate(date)]);
  return { date, max, used, remaining: Math.max(0, max - used) };
}

/**
 * Availability across every night of a stay: `remaining` is the minimum over
 * all nights, `fullDate` the first night that is fully booked (if any). This
 * is a best-effort pre-check for UX; the authoritative guard is the
 * enforce_booking_capacity trigger (migration 0003).
 */
export async function getAvailabilityForStay(stayDate: string, nights: number) {
  const lastNight = addDaysISO(stayDate, Math.max(1, nights) - 1);
  const [max, stays] = await Promise.all([
    getMaxGroupsPerDay(),
    fetchActiveStaysAround(stayDate, lastNight),
  ]);
  let remaining = max;
  let fullDate: string | null = null;
  for (let i = 0; i < Math.max(1, nights); i++) {
    const night = addDaysISO(stayDate, i);
    const nightRemaining = max - countStaysOverlapping(stays, night);
    if (nightRemaining < remaining) remaining = nightRemaining;
    if (nightRemaining <= 0 && !fullDate) fullDate = night;
  }
  remaining = Math.max(0, remaining);
  return { date: stayDate, nights, max, used: max - remaining, remaining, fullDate };
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
