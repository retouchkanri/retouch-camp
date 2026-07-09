import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = { title: "安全ルール" };

const RULE_GROUPS = [
  {
    title: "馬とのふれあいについて",
    rules: [
      "馬に近づく際は、必ずスタッフの指示に従ってください。",
      "馬の後方や死角から急に近づかないでください。",
      "大きな音や急な動きは馬を驚かせるため、お控えください。",
      "餌やりは、指定された餌のみを、指定の方法で行ってください。",
      "小さなお子様は、必ず保護者の方が付き添ってください。",
    ],
  },
  {
    title: "火気・設備の利用について",
    rules: [
      "直火は禁止です。焚き火台を必ずご使用ください。",
      "BBQ・焚き火は指定エリア内でのみ行ってください。",
      "消火用の水またはバケツを必ずご用意ください。",
      "花火は手持ちの小型のもののみ、指定エリアで使用可能です。",
      "たき火・BBQの後片付け（灰の処理含む）は必ず行ってください。",
    ],
  },
  {
    title: "滞在中のマナー",
    rules: [
      "夜22時以降は、他のゲストや馬たちのため静かにお過ごしください。",
      "ペット同伴の場合は事前にご相談ください（馬との接触エリアには入れません）。",
      "ゴミは分別の上、指定の集積所へお出しください。",
      "敷地内は禁煙です（喫煙エリアのみ可）。",
      "車両は指定の駐車スペース内に停めてください。",
    ],
  },
  {
    title: "緊急時の対応",
    rules: [
      "急な体調不良やケガの際は、直ちにスタッフ（管理棟）までご連絡ください。",
      "悪天候時は、安全確保のため体験内容を中止・変更する場合があります。",
      "緊急連絡先は、ご予約確定メールに記載してお送りします。",
    ],
  },
];

export default function RulesPage() {
  return (
    <>
      <section className="bg-forest-dark text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs tracking-[0.2em] text-terracotta uppercase">Safety Rules</p>
          <h1 className="max-w-2xl font-serif text-3xl leading-snug font-semibold sm:text-4xl">
            安全ルール
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
            馬たちと安全に、気持ちよく過ごしていただくために、以下のルールを必ずお守りください。ご予約時に同意をいただいております。
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-10 sm:grid-cols-2">
          {RULE_GROUPS.map((group) => (
            <div key={group.title}>
              <SectionHeading title={group.title} />
              <ul className="-mt-6 space-y-3 text-sm leading-relaxed text-charcoal-soft">
                {group.rules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-terracotta" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <div className="rounded-2xl bg-white p-8 text-sm leading-relaxed text-charcoal-soft shadow-sm">
          <p className="font-semibold text-forest-dark">
            馬は繊細な動物です。ルールを守ってご参加いただくことが、ゲストの皆さまと馬たち双方の安全につながります。
          </p>
          <p className="mt-3">
            ルール違反があった場合、体験の中止やご退場をお願いする場合がございます。あらかじめご了承ください。
          </p>
        </div>
      </Section>
    </>
  );
}
