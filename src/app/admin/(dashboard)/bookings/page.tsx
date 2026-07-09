import Link from "next/link";
import { listBookings } from "@/lib/booking";
import { STATUS_LABEL_JA, STATUS_BADGE_CLASS } from "@/lib/booking-labels";
import type { BookingStatus } from "@/types/database";

const TABS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "pending", label: "承認待ち" },
  { value: "approved", label: "承認済み" },
  { value: "rejected", label: "却下" },
  { value: "cancelled", label: "キャンセル" },
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = (status as BookingStatus | undefined) || undefined;
  const bookings = await listBookings({ status: activeStatus });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-forest-dark">予約一覧</h1>
        <p className="text-sm text-charcoal-soft">全{bookings.length}件</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/admin/bookings" : `/admin/bookings?status=${tab.value}`}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              (activeStatus ?? "all") === tab.value
                ? "border-terracotta bg-terracotta/10 text-terracotta-dark"
                : "border-sage/30 text-charcoal-soft"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-sage/10 text-charcoal-soft">
            <tr>
              <th className="px-5 py-3 font-medium">宿泊日</th>
              <th className="px-5 py-3 font-medium">お客様</th>
              <th className="px-5 py-3 font-medium">サイト</th>
              <th className="px-5 py-3 font-medium">人数</th>
              <th className="px-5 py-3 font-medium">金額</th>
              <th className="px-5 py-3 font-medium">ステータス</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/10">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-cream/50">
                <td className="px-5 py-3">
                  <Link href={`/admin/bookings/${b.id}`} className="block text-forest-dark">
                    {new Date(b.stay_date).toLocaleDateString("ja-JP")}
                    <span className="ml-1 text-xs text-charcoal-soft">({b.nights}泊)</span>
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <Link href={`/admin/bookings/${b.id}`} className="block">
                    {b.customer_name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-charcoal-soft">{b.site_type?.name_ja}</td>
                <td className="px-5 py-3 text-charcoal-soft">
                  大{b.num_adults}
                  {b.num_children > 0 && ` 子${b.num_children}`}
                  {b.num_infants > 0 && ` 乳${b.num_infants}`}
                </td>
                <td className="px-5 py-3 text-charcoal-soft">{b.total_price.toLocaleString()}円</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[b.status]}`}
                  >
                    {STATUS_LABEL_JA[b.status]}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-charcoal-soft">
                  該当する予約はありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
