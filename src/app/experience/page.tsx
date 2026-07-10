import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "馬と過ごす体験" };

const EXPERIENCES = [
  {
    code: "pony_fureai",
    title: "ポニーとのふれあい",
    price: "無料（宿泊者は自由に参加可能）",
    duration: "所要目安：15〜30分",
    desc: "ブラッシングやお散歩を通じて、ポニーと心を通わせる時間です。スタッフが接し方を丁寧にご案内するので、馬に触れるのが初めての方やお子様も安心してご参加いただけます。",
    hint: "horserest.jp の放牧写真のような、ゲストがポニーをブラッシングする様子",
  },
  {
    code: "esayari",
    title: "餌やり体験",
    price: "1,000円（1組あたり）",
    duration: "所要目安：10〜15分",
    desc: "牧草やニンジンを、馬たちに直接手渡しであげる体験。大きな馬がやさしく口を伸ばしてくる瞬間は、大人も子どもも思わず笑顔になります。",
    hint: "馬に餌を差し出すゲストの手元と、それを受け取る馬の表情のクローズアップ",
  },
  {
    code: "photo",
    title: "記念写真撮影",
    price: "3,000円（データ一式）",
    duration: "所要目安：20分",
    desc: "プロカメラマンが、馬たちと過ごすご家族・グループの様子を撮影します。撮影データは後日オンラインで納品。特別な一日の思い出をきれいな形で残せます。",
    hint: "bajigaku.net のような、馬とゲストが並ぶポートレート風の写真",
  },
  {
    code: "bbq",
    title: "BBQ体験",
    price: "4,500円（お一人あたり／食材・機材付き）",
    duration: "所要目安：夕方〜2時間程度",
    desc: "牧場の空気を感じながら味わうBBQディナー。地元食材を中心にしたセットをご用意し、手ぶらで気軽に楽しんでいただけます。",
    hint: "焚き火とBBQグリル、夕暮れの牧場を背景にしたゲストの食事風景",
  },
];

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow="Experience"
        title="馬と過ごす体験"
        description="滞在中は、ポニーとのふれあいから餌やり、記念撮影、BBQまで、さまざまな体験をお選びいただけます。ご予約時にオプションとしてお申し込みください。"
      />

      <Section tone="white">
        <div className="flex flex-col gap-16">
          {EXPERIENCES.map((exp, i) => (
            <div
              key={exp.code}
              className={`grid gap-10 lg:grid-cols-2 lg:items-center ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <ImagePlaceholder label={exp.title} description={exp.desc} sourceHint={exp.hint} aspect="video" />
              <div>
                <h2 className="font-serif text-xl font-semibold text-forest-dark sm:text-2xl">
                  {exp.title}
                </h2>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <span className="rounded-2xl bg-terracotta/10 px-3 py-1 font-medium text-terracotta-dark">
                    {exp.price}
                  </span>
                  <span className="rounded-2xl bg-sage/10 px-3 py-1 font-medium text-forest">
                    {exp.duration}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="Notice" title="ご参加にあたって" />
        <ul className="grid gap-3 text-sm leading-relaxed text-charcoal-soft sm:grid-cols-2">
          <li>・体験は天候や馬のコンディションにより内容を変更・中止する場合があります。</li>
          <li>・馬アレルギーをお持ちの方は事前にお知らせください。</li>
          <li>・安全のため、スタッフの指示に従ってご参加をお願いいたします。詳しくは「安全ルール」をご覧ください。</li>
          <li>・体験オプションは数に限りがあるため、事前予約をおすすめします。</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-4">
          <LinkButton href="/rules" variant="secondary">
            安全ルールを確認する
          </LinkButton>
          <LinkButton href="/booking" variant="primary">
            体験を選んで予約する
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
