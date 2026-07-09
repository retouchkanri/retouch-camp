import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-stats";
import { StatCard } from "@/components/admin/StatCard";
import { GROUP_TYPE_LABEL_JA } from "@/lib/booking-labels";
import type { GroupType } from "@/types/database";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-forest-dark">概要</h1>
        <p className="text-sm text-charcoal-soft">{stats.monthLabel}の運営状況</p>
      </div>

      {stats.pendingCount > 0 && (
        <Link
          href="/admin/bookings?status=pending"
          className="rounded-2xl border border-terracotta/40 bg-terracotta/10 p-5 text-sm font-medium text-terracotta-dark"
        >
          承認待ちの予約が{stats.pendingCount}件あります。確認する →
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="今月の予約件数" value={`${stats.totalBookings}件`} sub="承認待ち含む" />
        <StatCard label="承認済み予約" value={`${stats.confirmedBookings}件`} />
        <StatCard
          label="今月の売上見込み"
          value={`${stats.revenue.toLocaleString()}円`}
          sub="承認済み予約の合計"
        />
        <StatCard label="稼働率" value={`${stats.occupancyRate}%`} sub="1日4組限定の枠に対して" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-base font-semibold text-forest-dark">人気オプション（今月）</h2>
          {stats.optionCounts.length === 0 ? (
            <p className="mt-4 text-sm text-charcoal-soft">まだデータがありません。</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.optionCounts.map(({ option, count }) => (
                <li key={option.id} className="flex items-center justify-between text-sm">
                  <span className="text-charcoal-soft">{option.name_ja}</span>
                  <span className="font-semibold text-forest-dark">{count}件</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-base font-semibold text-forest-dark">顧客属性（今月・利用形態）</h2>
          {Object.keys(stats.groupTypeCounts).length === 0 ? (
            <p className="mt-4 text-sm text-charcoal-soft">まだデータがありません。</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {Object.entries(stats.groupTypeCounts).map(([key, count]) => (
                <li key={key} className="flex items-center justify-between text-sm">
                  <span className="text-charcoal-soft">
                    {GROUP_TYPE_LABEL_JA[key as GroupType] || key}
                  </span>
                  <span className="font-semibold text-forest-dark">{count}件</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link href="/admin/bookings" className="text-sm text-terracotta hover:text-terracotta-dark">
          予約一覧を見る →
        </Link>
        <Link href="/admin/calendar" className="text-sm text-terracotta hover:text-terracotta-dark">
          予約カレンダーを見る →
        </Link>
        <Link href="/admin/reports" className="text-sm text-terracotta hover:text-terracotta-dark">
          月次レポートを見る →
        </Link>
      </div>
    </div>
  );
}
