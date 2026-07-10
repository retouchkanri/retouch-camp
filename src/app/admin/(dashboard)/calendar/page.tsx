import Link from "next/link";
import { getBookingsInRange, getMaxGroupsPerDay } from "@/lib/booking";
import { STATUS_BADGE_CLASS, STATUS_LABEL_JA } from "@/lib/booking-labels";

function parseMonthParam(month?: string) {
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    return { year: y, month: m - 1 };
  }
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
}

function toISODate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const { year, month: monthIndex } = parseMonthParam(month);

  const start = toISODate(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const end = toISODate(year, monthIndex + 1, 1);

  const [bookings, maxPerDay] = await Promise.all([
    getBookingsInRange(start, end),
    getMaxGroupsPerDay(),
  ]);

  const byDate = new Map<string, typeof bookings>();
  for (const b of bookings) {
    const list = byDate.get(b.stay_date) ?? [];
    list.push(b);
    byDate.set(b.stay_date, list);
  }

  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = new Date(year, monthIndex - 1, 1);
  const nextMonth = new Date(year, monthIndex + 1, 1);
  const prevParam = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;
  const nextParam = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-semibold text-forest-dark">
          {year}年{monthIndex + 1}月の予約カレンダー
        </h1>
        <div className="flex gap-2">
          <Link
            href={`/admin/calendar?month=${prevParam}`}
            className="rounded-2xl border border-sage/30 px-4 py-1.5 text-sm text-charcoal-soft"
          >
            ← 前月
          </Link>
          <Link
            href={`/admin/calendar?month=${nextParam}`}
            className="rounded-2xl border border-sage/30 px-4 py-1.5 text-sm text-charcoal-soft"
          >
            翌月 →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-charcoal-soft">
        {["日", "月", "火", "水", "木", "金", "土"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateStr = toISODate(year, monthIndex, day);
          const dayBookings = byDate.get(dateStr) ?? [];
          const isFull = dayBookings.length >= maxPerDay;

          return (
            <div
              key={dateStr}
              className={`min-h-[110px] rounded-xl border p-2 text-left ${
                isFull ? "border-terracotta/40 bg-terracotta/5" : "border-sage/20 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-charcoal-soft">{day}</span>
                <span
                  className={`text-[10px] font-semibold ${isFull ? "text-terracotta" : "text-sage"}`}
                >
                  {dayBookings.length}/{maxPerDay}
                </span>
              </div>
              <div className="mt-1 flex flex-col gap-1">
                {dayBookings.slice(0, 3).map((b) => (
                  <Link
                    key={b.id}
                    href={`/admin/bookings/${b.id}`}
                    className={`truncate rounded px-1.5 py-0.5 text-[10px] ${STATUS_BADGE_CLASS[b.status]}`}
                    title={`${b.customer_name} - ${STATUS_LABEL_JA[b.status]}`}
                  >
                    {b.customer_name}
                  </Link>
                ))}
                {dayBookings.length > 3 && (
                  <span className="text-[10px] text-charcoal-soft">+{dayBookings.length - 3}件</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
