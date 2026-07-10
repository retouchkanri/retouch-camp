import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "サイト案内" };

const SITES = [
  {
    name: "キャンピングカーサイト（2区画）",
    price: "12,000円 / 泊",
    capacity: "1組あたり4名まで目安",
    features: [
      "ご宿泊用キャンピングカーを設置。手軽にアウトドア気分を楽しめます。",
      "電源(AC100V)完備",
      "中央のポニー放牧場を望む",
      "駐車スペース1台分",
    ],
    hint: "設置されたご宿泊用キャンピングカーと中央のポニー放牧場",
  },
  {
    name: "フリーサイト（2区画）",
    price: "8,000円 / 泊",
    capacity: "テント2張まで目安",
    features: [
      "テントやキャンピングカーの持ち込みが可能です。",
      "芝生の区画サイト",
      "タープ設営自由",
      "近接水道あり",
    ],
    hint: "芝生にテントとタープを設営してくつろぐゲストの様子",
  },
];

const OVERVIEW = [
  ["キャンピングカーサイト", "2区画"],
  ["フリーサイト", "2区画（テント・キャンピングカー持ち込み可）"],
  ["定員", "1日4組限定"],
  ["中央", "ポニー放牧場"],
  ["バーベキュー", "可能"],
  ["焚火・直火", "禁止"],
  ["施設タイプ", "静かに馬と過ごす滞在型施設"],
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
        description="真ん中にはポニーたちの放牧場。その周りに小さな宿泊サイトを配置し、人と馬が自然に共存できる空間をつくります。1日4組限定・静かに馬と過ごす滞在型施設です。"
      />

      <Section tone="cream">
        <SectionHeading eyebrow="Overview" title="施設概要" />
        <div className="overflow-x-auto rounded-2xl border border-sage/20 bg-white">
          <table className="w-full min-w-[420px] text-left text-sm">
            <tbody className="divide-y divide-sage/10">
              {OVERVIEW.map(([label, value]) => (
                <tr key={label}>
                  <th className="w-1/3 px-6 py-4 font-medium text-forest-dark">{label}</th>
                  <td className="px-6 py-4 text-charcoal-soft">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-charcoal-soft">
          ※安全管理上、焚火・直火は禁止しております。
        </p>
      </Section>

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
        <SectionHeading
          eyebrow="Paddock"
          title="中央にはポニーたちの放牧場"
          description="どのサイトからも、のんびりと過ごすポニーたちの姿を見ることができます。朝、窓を開けると馬たちが草を食べている。そんな贅沢な時間をお楽しみください。"
        />
        <ImagePlaceholder
          label="ポニー放牧場"
          description="サイトから眺める、中央の放牧場でのんびり過ごすポニーたちの様子。"
          aspect="wide"
        />
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Facilities" title="共用設備" />
        <div className="grid gap-4 sm:grid-cols-3">
          {FACILITIES.map((f) => (
            <div key={f} className="rounded-xl bg-white p-5 text-sm text-charcoal-soft shadow-sm">
              {f}
            </div>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Map" title="サイト配置図" />
        <ImagePlaceholder
          label="敷地マップ"
          description="中央のポニー放牧場と、それを囲むキャンピングカーサイト・フリーサイト・管理棟・トイレ等の配置を示す簡易マップ／イラスト。"
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
