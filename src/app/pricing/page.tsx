import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "料金案内" };

export default function PricingPage() {
  return (
    <>
      <section className="bg-forest-dark text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs tracking-[0.2em] text-terracotta uppercase">Pricing</p>
          <h1 className="max-w-2xl font-serif text-3xl leading-snug font-semibold sm:text-4xl">
            料金案内
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
            ※以下は仮の料金設定です。実際の金額に置き換えてご利用ください（管理者ダッシュボードから変更できます）。
          </p>
        </div>
      </section>

      <Section tone="white">
        <SectionHeading eyebrow="Site Fee" title="サイト利用料（1泊）" />
        <div className="overflow-x-auto rounded-2xl border border-sage/20">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-cream text-charcoal-soft">
              <tr>
                <th className="px-6 py-4 font-medium">サイト種別</th>
                <th className="px-6 py-4 font-medium">料金</th>
                <th className="px-6 py-4 font-medium">定員目安</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/10">
              <tr>
                <td className="px-6 py-4 font-medium text-forest-dark">キャンピングカーサイト</td>
                <td className="px-6 py-4">12,000円</td>
                <td className="px-6 py-4 text-charcoal-soft">1台・4名まで目安</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-forest-dark">フリーサイト</td>
                <td className="px-6 py-4">8,000円</td>
                <td className="px-6 py-4 text-charcoal-soft">テント2張・4名まで目安</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Options" title="体験オプション料金" />
        <div className="overflow-x-auto rounded-2xl border border-sage/20 bg-white">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-cream text-charcoal-soft">
              <tr>
                <th className="px-6 py-4 font-medium">体験内容</th>
                <th className="px-6 py-4 font-medium">料金</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/10">
              <tr>
                <td className="px-6 py-4 font-medium text-forest-dark">ポニーとのふれあい</td>
                <td className="px-6 py-4">無料（宿泊者）</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-forest-dark">餌やり体験</td>
                <td className="px-6 py-4">1,000円 / 組</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-forest-dark">記念写真撮影</td>
                <td className="px-6 py-4">3,000円 / 組</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-forest-dark">BBQセット</td>
                <td className="px-6 py-4">4,500円 / 人</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Notice" title="ご料金についての注意事項" />
        <ul className="space-y-2 text-sm leading-relaxed text-charcoal-soft">
          <li>・表示価格はすべて税込です。</li>
          <li>・お支払いは当日現地にて（現金・一部QR決済対応予定）となります。</li>
          <li>・キャンセルポリシーは「FAQ」ページをご確認ください。</li>
          <li>・小学生未満のお子様の宿泊料は無料です（体験オプションは別途）。</li>
        </ul>
        <div className="mt-8">
          <LinkButton href="/booking" variant="primary">
            料金を確認して予約する
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
