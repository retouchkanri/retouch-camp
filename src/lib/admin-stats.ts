import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { getMaxGroupsPerDay } from "@/lib/booking";
import type { Booking, BookingOption, ExperienceOption } from "@/types/database";

function monthRange(reference = new Date()) {
  const start = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), 1));
  const end = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + 1, 1));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

function countBy<T extends string>(items: (T | null)[], fallback = "未回答") {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = item || fallback;
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export async function getMonthlyReport(reference = new Date()) {
  const monthLabel = reference.toLocaleDateString("ja-JP", { year: "numeric", month: "long" });
  if (!isSupabaseAdminConfigured()) {
    return {
      monthLabel,
      bookings: [] as Booking[],
      byStatus: { pending: 0, approved: 0, rejected: 0, cancelled: 0 },
      revenue: 0,
      totalGuests: 0,
      avgSatisfaction: null,
      regionBreakdown: [] as [string, number][],
      groupTypeBreakdown: [] as [string, number][],
      referralBreakdown: [] as [string, number][],
      repeatIntentionBreakdown: [] as [string, number][],
    };
  }
  const supabase = createAdminClient();
  const { start, end } = monthRange(reference);

  const { data } = await supabase
    .from("bookings")
    .select("*")
    .gte("stay_date", start)
    .lt("stay_date", end);
  const bookings = (data as Booking[]) ?? [];

  const byStatus = {
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const confirmed = bookings.filter((b) => b.status === "approved");
  const revenue = confirmed.reduce((sum, b) => sum + b.total_price, 0);
  const totalGuests = confirmed.reduce(
    (sum, b) => sum + b.num_adults + b.num_children + b.num_infants,
    0,
  );

  const bookingIdsInMonth = new Set(bookings.map((b) => b.id));
  const { data: surveyRows } = await supabase
    .from("surveys")
    .select("satisfaction_score, responded_at, booking_id")
    .not("responded_at", "is", null);
  const scores = (surveyRows ?? [])
    .filter((s) => bookingIdsInMonth.has(s.booking_id))
    .map((s) => s.satisfaction_score as number | null)
    .filter((s): s is number => s !== null);
  const avgSatisfaction = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  return {
    monthLabel: reference.toLocaleDateString("ja-JP", { year: "numeric", month: "long" }),
    bookings,
    byStatus,
    revenue,
    totalGuests,
    avgSatisfaction,
    regionBreakdown: countBy(confirmed.map((b) => b.region)),
    groupTypeBreakdown: countBy(confirmed.map((b) => b.group_type)),
    referralBreakdown: countBy(confirmed.map((b) => b.referral_source)),
    repeatIntentionBreakdown: countBy(confirmed.map((b) => b.repeat_intention)),
  };
}

export async function getDashboardStats(reference = new Date()) {
  const monthLabel = reference.toLocaleDateString("ja-JP", { year: "numeric", month: "long" });
  if (!isSupabaseAdminConfigured()) {
    return {
      monthLabel,
      totalBookings: 0,
      confirmedBookings: 0,
      pendingCount: 0,
      revenue: 0,
      occupancyRate: 0,
      groupTypeCounts: {},
      optionCounts: [] as { option: ExperienceOption; count: number }[],
    };
  }
  const supabase = createAdminClient();
  const { start, end } = monthRange(reference);

  const [{ data: monthBookings }, { count: pendingCount }, { data: allOptions }] = await Promise.all([
    supabase
      .from("bookings")
      .select("*")
      .gte("stay_date", start)
      .lt("stay_date", end)
      .neq("status", "cancelled")
      .neq("status", "rejected"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("experience_options").select("*"),
  ]);

  const bookings = (monthBookings as Booking[]) ?? [];
  const confirmed = bookings.filter((b) => b.status === "approved");
  const revenue = confirmed.reduce((sum, b) => sum + b.total_price, 0);

  const maxPerDay = await getMaxGroupsPerDay();
  const daysInMonth = new Date(
    reference.getUTCFullYear(),
    reference.getUTCMonth() + 1,
    0,
  ).getDate();
  const totalCapacity = maxPerDay * daysInMonth;
  const occupancyRate = totalCapacity > 0 ? Math.round((bookings.length / totalCapacity) * 100) : 0;

  const groupTypeCounts: Record<string, number> = {};
  for (const b of bookings) {
    const key = b.group_type || "未回答";
    groupTypeCounts[key] = (groupTypeCounts[key] || 0) + 1;
  }

  const bookingIds = bookings.map((b) => b.id);
  let optionCounts: { option: ExperienceOption; count: number }[] = [];
  if (bookingIds.length > 0) {
    const { data: bookingOptions } = await supabase
      .from("booking_options")
      .select("*")
      .in("booking_id", bookingIds);
    const counts = new Map<string, number>();
    for (const row of (bookingOptions as BookingOption[]) ?? []) {
      counts.set(row.option_id, (counts.get(row.option_id) || 0) + row.quantity);
    }
    optionCounts = ((allOptions as ExperienceOption[]) ?? [])
      .map((opt) => ({ option: opt, count: counts.get(opt.id) || 0 }))
      .filter((o) => o.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  return {
    monthLabel: reference.toLocaleDateString("ja-JP", { year: "numeric", month: "long" }),
    totalBookings: bookings.length,
    confirmedBookings: confirmed.length,
    pendingCount: pendingCount ?? 0,
    revenue,
    occupancyRate,
    groupTypeCounts,
    optionCounts,
  };
}
