import Link from "next/link";
import { listSurveysWithBookings } from "@/lib/survey";
import { StatCard } from "@/components/admin/StatCard";

export default async function AdminSurveysPage() {
  const surveys = await listSurveysWithBookings();

  const avgScore =
    surveys.length > 0
      ? (
          surveys.reduce((sum, s) => sum + (s.satisfaction_score || 0), 0) / surveys.length
        ).toFixed(1)
      : "-";

  const tagCounts = new Map<string, number>();
  for (const s of surveys) {
    for (const tag of s.ai_tags || []) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }
  const sortedTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-forest-dark">アンケート結果</h1>
        <p className="text-sm text-charcoal-soft">回答{surveys.length}件</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="平均満足度" value={`${avgScore} / 5`} />
        <StatCard label="回答件数" value={`${surveys.length}件`} />
        <StatCard
          label="よく挙がるキーワード"
          value={sortedTags[0]?.[0] || "-"}
          sub={sortedTags.slice(0, 4).map(([t, c]) => `${t}(${c})`).join(" / ")}
        />
      </div>

      <div className="flex flex-col gap-4">
        {surveys.map((s) => (
          <div key={s.id} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-forest-dark">{s.booking?.customer_name}</p>
                <p className="text-xs text-charcoal-soft">
                  {s.booking && new Date(s.booking.stay_date).toLocaleDateString("ja-JP")} 滞在
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-terracotta">{"★".repeat(s.satisfaction_score || 0)}</span>
                <Link
                  href={`/admin/bookings/${s.booking_id}`}
                  className="text-xs text-charcoal-soft underline"
                >
                  予約詳細
                </Link>
              </div>
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {s.memorable_experience && (
                <div>
                  <dt className="text-xs text-charcoal-soft">印象に残った体験</dt>
                  <dd className="text-forest-dark">{s.memorable_experience}</dd>
                </div>
              )}
              {s.improvement_points && (
                <div>
                  <dt className="text-xs text-charcoal-soft">改善してほしい点</dt>
                  <dd className="text-forest-dark">{s.improvement_points}</dd>
                </div>
              )}
              {s.revisit_intention && (
                <div>
                  <dt className="text-xs text-charcoal-soft">リピート意向</dt>
                  <dd className="text-forest-dark">{s.revisit_intention}</dd>
                </div>
              )}
              {s.large_facility_wishes && (
                <div>
                  <dt className="text-xs text-charcoal-soft">大規模施設に求めること</dt>
                  <dd className="text-forest-dark">{s.large_facility_wishes}</dd>
                </div>
              )}
            </dl>

            {s.ai_tags && s.ai_tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {s.ai_tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-sage/10 px-3 py-1 text-xs text-forest">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {surveys.length === 0 && (
          <p className="rounded-2xl bg-white p-10 text-center text-sm text-charcoal-soft shadow-sm">
            まだアンケート回答がありません。
          </p>
        )}
      </div>
    </div>
  );
}
