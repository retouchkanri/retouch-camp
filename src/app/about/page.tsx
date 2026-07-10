import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "施設コンセプト" };

const OFFERINGS = [
  "馬のいる風景を楽しむ",
  "動物と触れ合う喜びを感じる",
  "引退馬のことを知る",
  "地域の魅力を再発見する",
];

const VERIFICATION_QUESTIONS = [
  "「馬がいることで、人はどのように過ごすのか。」",
  "「どのような層が訪れ、どんな体験を求めるのか。」",
  "「地域の観光資源としてどの程度の可能性があるのか。」",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Concept"
        title={
          <>
            Retouch Horse Gardenとは？
          </>
        }
        description="Retouchが運営する「馬と人をつなぐ小さな滞在施設」です。私たちは、引退競走馬やポニーたちの新しい活躍の場をつくるため、この小さなホースガーデンをスタートしました。"
      />

      <Section tone="cream">
        <ImagePlaceholder
          label="施設コンセプトメイン写真"
          description="中央のポニー放牧場と、それを囲む宿泊サイトが同一フレームに収まる、コンセプトを象徴する一枚。"
          sourceHint="horserest.jp のコンセプトページ写真のような穏やかな雰囲気"
          aspect="wide"
        />
      </Section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Space"
              title="人と馬が自然に共存できる空間"
              description="真ん中にはポニーたちの放牧場。その周りに小さな宿泊サイトを配置し、人と馬が自然に共存できる空間をつくります。ここは、静かに馬と過ごす滞在型施設です。"
            />
            <p className="text-sm leading-relaxed text-charcoal-soft">
              宿泊を通じて、そんな時間を提供したいと考えています。
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-charcoal-soft">
              {OFFERINGS.map((o) => (
                <li key={o} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sage" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <ImagePlaceholder
            label="放牧場とサイトの配置"
            description="中央の放牧場を囲むように配置された宿泊サイトの俯瞰イメージ。"
            aspect="square"
          />
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading
          eyebrow="Small Experiment"
          title="小さな実証実験の場"
          description="この場所は、大規模なキャンプ場ではありません。"
          align="center"
        />
        <div className="mx-auto max-w-2xl">
          <ul className="space-y-4">
            {VERIFICATION_QUESTIONS.map((q) => (
              <li
                key={q}
                className="rounded-2xl bg-white p-6 text-center font-serif text-sm leading-relaxed text-forest-dark shadow-sm sm:text-base"
              >
                {q}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm leading-relaxed text-charcoal-soft">
            それを検証するための、小さな実証実験の場です。
          </p>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Future"
              title="将来構想"
              description="ここで得られたデータをもとに、将来的には河内長野市のまちづくりや、寺ヶ池公園でのイベント・滞在コンテンツへ展開していくことを目指します。このホースガーデンで得られた経験やデータを活かし、将来的には河内長野市での新しい観光コンテンツや、馬を活用した地域づくりへとつなげていきたいと考えています。"
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
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">私たちの想い</h2>
          <ImagePlaceholder
            label="スタッフ紹介写真"
            description="馬と並んで立つスタッフのポートレート写真。"
            aspect="square"
            className="max-w-xs"
          />
          <div className="max-w-xl space-y-4 text-sm leading-relaxed text-charcoal-soft">
            <p>Retouchは、引退競走馬たちの命をつなぐ活動を行っています。</p>
            <p>この場所は、単なる宿泊施設ではありません。</p>
            <p>
              馬を身近に感じてもらい、動物と人が共に過ごす時間の価値を知っていただくための、小さな挑戦です。
            </p>
            <p>皆さまがここで過ごしてくださる時間が、馬たちの未来を支える力になります。</p>
          </div>
          <LinkButton href="/retouch" variant="secondary">
            Retouchの取り組みを見る →
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
