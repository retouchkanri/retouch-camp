import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "サイト案内" };

const SITES = [
  {
    name: "キャンピングカーサイト",
    price: "12,000円 / 泊",
    capacity: "1台まで（それ以上は要相談）",
    features: ["電源(AC100V)完備", "ポニーパドックに隣接", "駐車スペース1台分", "夜間照明あり"],
    hint: "電源付きサイトに停まったキャンピングカーと隣接するポニーパドック",
  },
  {
    name: "フリーサイト",
    price: "8,000円 / 泊",
    capacity: "テント2張まで目安",
    features: ["芝生の区画サイト", "焚き火可（直火不可・焚き火台使用）", "タープ設営自由", "近接水道あり"],
    hint: "芝生にテントとタープを設営し、焚き火を囲むゲストの様子",
  },
];

const FACILITIES = [
  "共用トイレ・洗面所",
  "温水シャワー（要予約・時間制）",
  "炊事棟",
  "ゴミ集積所（分別回収）",
  "駐車場（各サイト1台分）",
  "Wi-Fi（管理棟周辺）",
];

export default function SitesPage() {
  return (
    <>
      <PageHero
        eyebrow="Sites"
        title="サイト案内"
        description="キャンピングカーサイトとフリーサイトの2種類。1日4組限定なので、それぞれのサイトを広々とお使いいただけます。"
      />

      <Section tone="white">
        <div className="grid gap-8 lg:grid-cols-2">
          {SITES.map((site) => (
            <div key={site.name} className="overflow-hidden rounded-2xl border border-sage/20">
              <ImagePlaceholder
                label={site.name}
                description={`${site.name}の実際の様子を伝える写真。`}
                sourceHint={site.hint}
                aspect="video"
                className="rounded-none border-0"
              />
              <div className="p-8">
                <h2 className="font-serif text-xl font-semibold text-forest-dark">{site.name}</h2>
                <p className="mt-1 text-lg font-semibold text-terracotta">{site.price}</p>
                <p className="mt-1 text-sm text-charcoal-soft">定員目安：{site.capacity}</p>
                <ul className="mt-4 space-y-2 text-sm text-charcoal-soft">
                  {site.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sage" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Facilities" title="共用設備" />
        <div className="grid gap-4 sm:grid-cols-3">
          {FACILITIES.map((f) => (
            <div key={f} className="rounded-xl bg-white p-5 text-sm text-charcoal-soft shadow-sm">
              {f}
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Map" title="サイト配置図" />
        <ImagePlaceholder
          label="敷地マップ"
          description="キャンピングカーサイト・フリーサイト・ポニーパドック・管理棟・トイレ等の配置を示す簡易マップ／イラスト。"
          aspect="wide"
        />
      </Section>

      <Section tone="forest">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">サイトを選んで予約する</h2>
          <LinkButton href="/booking" variant="primary">
            予約ページへ
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
