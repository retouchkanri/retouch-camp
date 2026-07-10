import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "予約はいつから可能ですか？",
    a: "3ヶ月先までのご予約を随時受け付けています。1日4組限定のため、人気の週末は早めに埋まることがあります。",
  },
  {
    q: "予約はすぐに確定しますか？",
    a: "お申し込み後、内容を確認のうえ運営スタッフが承認します。承認され次第、確認メールをお送りします。通常1〜2営業日以内にご連絡します。",
  },
  {
    q: "キャンセルはできますか？",
    a: "確認メールに記載のキャンセルリンクからお手続きいただけます。宿泊日の7日前まで無料、6〜3日前は50%、2日前からはキャンセル料100%を頂戴します。",
  },
  {
    q: "雨天でも利用できますか？",
    a: "小雨程度であれば通常通りご利用いただけます。荒天が予想される場合は、安全のため個別にご連絡し、日程変更等をご相談させていただきます。",
  },
  {
    q: "馬に触れたことがなくても大丈夫ですか？",
    a: "はい、初めての方も多くご参加いただいています。スタッフが接し方を丁寧にご案内しますので、安心してご参加ください。",
  },
  {
    q: "子連れでも利用できますか？",
    a: "もちろんです。小学生未満のお子様の宿泊料は無料です。安全のため、体験中は保護者の方の付き添いをお願いしています。",
  },
  {
    q: "ペットは同伴できますか？",
    a: "リードを付けた状態であればフリーサイトのみ同伴可能です。馬との接触エリアには入れませんので、あらかじめご了承ください。事前にご相談ください。",
  },
  {
    q: "食材や機材の持ち込みはできますか？",
    a: "フリーサイトでは持ち込みのBBQ機材のご利用も可能です（直火は禁止・焚き火台をご使用ください）。BBQセットのご注文も承っています。",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="よくある質問" />

      <Section tone="cream">
        <SectionHeading title="ご予約・キャンセルについて" />
        <FaqAccordion items={FAQS} />
      </Section>
    </>
  );
}
