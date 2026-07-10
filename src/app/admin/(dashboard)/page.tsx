import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-stats";
import { listBookings } from "@/lib/booking";
import { StatCard } from "@/components/admin/StatCard";
import { BreakdownList } from "@/components/admin/BreakdownList";
import { GROUP_TYPE_LABEL_JA, STATUS_LABEL_JA, STATUS_BADGE_CLASS } from "@/lib/booking-labels";

export default async function AdminDashboardPage() {
  const [stats, recentBookings] = await Promise.all([getDashboardStats(), listBookings()]);

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

      {/* 売上集計・稼働率 */}
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

      {/* アンケート結果・口コミ管理 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="アンケート平均満足度（今月）"
          value={stats.avgSatisfaction ? `${stats.avgSatisfaction.toFixed(1)} / 5` : "-"}
          sub={`回答${stats.surveyResponseCount}件`}
        />
        <StatCard label="公開中の口コミ" value={`${stats.reviewStats.published}件`} />
        <StatCard
          label="未公開の口コミ"
          value={`${stats.reviewStats.unpublished}件`}
          sub={stats.reviewStats.unpublished > 0 ? "確認待ちがあります" : undefined}
        />
        <div className="flex flex-col justify-center gap-2 rounded-2xl bg-white p-6 shadow-sm">
          <Link href="/admin/surveys" className="text-sm text-terracotta hover:text-terracotta-dark">
            アンケート結果を見る →
          </Link>
          <Link href="/admin/reviews" className="text-sm text-terracotta hover:text-terracotta-dark">
            口コミを管理する →
          </Link>
        </div>
      </div>

      {/* 予約一覧（直近） */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold text-forest-dark">直近の予約</h2>
          <Link href="/admin/bookings" className="text-sm text-terracotta hover:text-terracotta-dark">
            予約一覧を見る →
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="mt-4 text-sm text-charcoal-soft">まだ予約がありません。</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs text-charcoal-soft">
                <tr>
                  <th className="py-2 pr-4 font-medium">宿泊日</th>
                  <th className="py-2 pr-4 font-medium">お客様名</th>
                  <th className="py-2 pr-4 font-medium">サイト</th>
                  <th className="py-2 pr-4 font-medium">金額</th>
                  <th className="py-2 font-medium">ステータス</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {recentBookings.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td className="py-2 pr-4 text-charcoal-soft">
                      {new Date(b.stay_date).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="py-2 pr-4 font-medium text-forest-dark">{b.customer_name}</td>
                    <td className="py-2 pr-4 text-charcoal-soft">{b.site_type?.name_ja}</td>
                    <td className="py-2 pr-4 text-charcoal-soft">
                      {b.total_price.toLocaleString()}円
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded-2xl px-3 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[b.status]}`}
                      >
                        {STATUS_LABEL_JA[b.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 人気オプション・人気日程 */}
      <div className="grid gap-6 lg:grid-cols-3">
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

        <BreakdownList title="人気の曜日（全期間）" data={stats.popularWeekdays} />
        <BreakdownList title="人気の宿泊日 上位5件（全期間）" data={stats.popularDates} />
      </div>

      {/* 顧客属性 */}
      <div>
        <h2 className="mb-4 font-serif text-base font-semibold text-forest-dark">顧客属性（今月）</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <BreakdownList
            title="利用形態"
            data={Object.entries(stats.groupTypeCounts)}
            labelMap={GROUP_TYPE_LABEL_JA as Record<string, string>}
          />
          <BreakdownList title="地域" data={stats.regionBreakdown} />
          <BreakdownList title="ご利用目的" data={stats.purposeBreakdown} />
          <div className="flex flex-col justify-center gap-2 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-charcoal-soft">
              来場きっかけ・リピート意向を含む詳細な顧客属性は月次レポートでご確認いただけます。
            </p>
            <Link href="/admin/reports" className="text-sm text-terracotta hover:text-terracotta-dark">
              月次レポートを見る →
            </Link>
          </div>
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
