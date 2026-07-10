import Link from "next/link";
import { getMonthlyReport } from "@/lib/admin-stats";
import { StatCard } from "@/components/admin/StatCard";
import { BreakdownList } from "@/components/admin/BreakdownList";
import { CsvExportButton } from "@/components/admin/CsvExportButton";
import { GROUP_TYPE_LABEL_JA } from "@/lib/booking-labels";

function parseMonthParam(month?: string) {
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, 1));
  }
  return new Date();
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const reference = parseMonthParam(month);
  const report = await getMonthlyReport(reference);

  const prevMonth = new Date(reference.getUTCFullYear(), reference.getUTCMonth() - 1, 1);
  const nextMonth = new Date(reference.getUTCFullYear(), reference.getUTCMonth() + 1, 1);
  const prevParam = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;
  const nextParam = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest-dark">
            月次レポート — {report.monthLabel}
          </h1>
          <p className="text-sm text-charcoal-soft">
            行政・関係者向けの需要説明資料としてもご活用いただけます。
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/reports?month=${prevParam}`}
            className="rounded-2xl border border-sage/30 px-4 py-1.5 text-sm text-charcoal-soft"
          >
            ← 前月
          </Link>
          <Link
            href={`/admin/reports?month=${nextParam}`}
            className="rounded-2xl border border-sage/30 px-4 py-1.5 text-sm text-charcoal-soft"
          >
            翌月 →
          </Link>
          <CsvExportButton bookings={report.bookings} filename={`bookings-${report.monthLabel}.csv`} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="承認済み予約" value={`${report.byStatus.approved}件`} />
        <StatCard label="売上合計" value={`${report.revenue.toLocaleString()}円`} />
        <StatCard label="のべ利用人数" value={`${report.totalGuests}名`} />
        <StatCard
          label="アンケート平均満足度"
          value={report.avgSatisfaction ? `${report.avgSatisfaction.toFixed(1)} / 5` : "-"}
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-base font-semibold text-forest-dark">予約ステータス内訳</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-xs text-charcoal-soft">承認待ち</p>
            <p className="font-semibold text-forest-dark">{report.byStatus.pending}件</p>
          </div>
          <div>
            <p className="text-xs text-charcoal-soft">承認済み</p>
            <p className="font-semibold text-forest-dark">{report.byStatus.approved}件</p>
          </div>
          <div>
            <p className="text-xs text-charcoal-soft">却下</p>
            <p className="font-semibold text-forest-dark">{report.byStatus.rejected}件</p>
          </div>
          <div>
            <p className="text-xs text-charcoal-soft">キャンセル</p>
            <p className="font-semibold text-forest-dark">{report.byStatus.cancelled}件</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <BreakdownList title="来場者の地域" data={report.regionBreakdown} />
        <BreakdownList
          title="利用形態"
          data={report.groupTypeBreakdown}
          labelMap={GROUP_TYPE_LABEL_JA as Record<string, string>}
        />
        <BreakdownList title="ご利用目的" data={report.purposeBreakdown} />
        <BreakdownList title="来場きっかけ" data={report.referralBreakdown} />
        <BreakdownList title="リピート意向" data={report.repeatIntentionBreakdown} />
      </div>
    </div>
  );
}
