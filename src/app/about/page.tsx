import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "施設コンセプト" };

const PILLARS = [
  {
    title: "馬と暮らす牧場のそばで",
    desc: "競走馬を引退した馬たちが暮らす牧場のすぐ隣に、キャンプサイトを構えました。柵越しに馬たちの気配を感じながら過ごす一晩は、他のキャンプ場では味わえない特別な時間です。",
  },
  {
    title: "1日4組限定、静かな時間",
    desc: "あえて数を絞ることで、混雑のないゆったりとした滞在を実現。予約制だからこそ、スタッフが一組一組に丁寧に向き合うことができます。",
  },
  {
    title: "滞在が、支援になる",
    desc: "宿泊料の一部は、引退馬支援活動「Retouch」を通じて、引退馬たちの飼養費やリトレーニング費用に充てられます。楽しむことがそのまま、社会貢献につながる仕組みです。",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Concept"
        title={
          <>
            馬と、人と、緑と。
            <br />
            ここにしかない時間を。
          </>
        }
        description="Retouch Horse Gardenは、大阪府河内長野市の豊かな自然の中にある、1日4組限定の体験型ホースキャンプ施設です。単なる宿泊施設ではなく、馬たちとの出会いと、引退馬支援という社会的な取り組みをつなぐ場所として運営しています。"
      />

      <Section tone="cream">
        <ImagePlaceholder
          label="施設コンセプトメイン写真"
          description="牧場に佇む馬とキャンプサイトが同一フレームに収まる、コンセプトを象徴する一枚。"
          sourceHint="horserest.jp のコンセプトページ写真のような穏やかな雰囲気"
          aspect="wide"
        />
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Why Retouch Horse Garden" title="3つの想い" align="center" />
        <div className="grid gap-8 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl bg-cream p-8">
              <h3 className="font-serif text-lg font-semibold text-forest-dark">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Location"
              title="河内長野市の里山、寺ヶ池のほど近くに"
              description="大阪市内から車で約40分。里山と緑に囲まれたロケーションは、将来的に寺ヶ池公園エリアと連携した大規模キャンプ場構想の第一歩としても位置づけています。まずはこの小さな牧場から、馬と人との新しい関わり方を育てていきます。"
            />
            <LinkButton href="/access" variant="ghost">
              アクセス情報を見る →
            </LinkButton>
          </div>
          <ImagePlaceholder
            label="周辺の里山風景"
            description="河内長野市の緑豊かな里山・寺ヶ池周辺の風景写真。"
            aspect="video"
          />
        </div>
      </Section>

      <Section tone="forest">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
            スタッフより
          </h2>
          <ImagePlaceholder
            label="スタッフ紹介写真"
            description="馬と並んで立つスタッフのポートレート写真。"
            aspect="square"
            className="max-w-xs"
          />
          <p className="max-w-xl text-sm leading-relaxed text-charcoal-soft">
            「馬たちのセカンドキャリアを、多くの方に知っていただきたい」という想いから、この施設を始めました。ここでの体験を通じて、引退馬という存在をもっと身近に感じていただけたら嬉しいです。
          </p>
        </div>
      </Section>
    </>
  );
}
