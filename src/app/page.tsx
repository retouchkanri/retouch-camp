import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/types/database";

const EXPERIENCES = [
  {
    title: "ポニーとのふれあい",
    desc: "ブラッシングやお散歩で、ポニーとゆっくり心を通わせる時間。",
    hint: "horserest.jp の放牧写真のような、柔らかい自然光の中でポニーに触れる様子",
  },
  {
    title: "餌やり体験",
    desc: "手のひらから直接エサをあげる、子どもも大人も夢中になる体験。",
    hint: "馬に餌を差し出すゲストの手元・表情のクローズアップ",
  },
  {
    title: "記念写真撮影",
    desc: "馬たちと過ごした瞬間を、プロカメラマンが写真に残します。",
    hint: "bajigaku.net のような馬とゲストのポートレート風カット",
  },
  {
    title: "BBQ体験",
    desc: "牧場の空気の中、緑に囲まれてゆったり味わうBBQディナー。",
    hint: "焚き火・BBQグリルと夕暮れの牧場風景",
  },
];

async function getPublishedReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3);
    return (data as Review[]) ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const reviews = await getPublishedReviews();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-dark text-cream">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-4 inline-block rounded-full border border-terracotta/60 px-4 py-1 text-xs tracking-[0.2em] text-terracotta uppercase">
              1日4組限定・完全予約制
            </p>
            <h1 className="font-serif text-3xl leading-snug font-semibold sm:text-4xl lg:text-5xl">
              一泊が、
              <br />
              引退馬の未来につながる。
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/80 sm:text-base">
              大阪府河内長野市。豊かな緑に囲まれたホースガーデンで、ポニーとのふれあいや餌やり、BBQを楽しむ一泊二日。ここでの滞在は、引退した競走馬たちを支える活動へとつながっています。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <LinkButton href="/booking" variant="primary">
                空き状況を見て予約する
              </LinkButton>
              <LinkButton
                href="/about"
                variant="secondary"
                className="border-cream/50 text-cream hover:bg-cream hover:text-forest-dark"
              >
                施設コンセプトを見る
              </LinkButton>
            </div>
          </div>

          <ImagePlaceholder
            label="ヒーロービジュアル"
            description="緑の牧場を背景に、ゲストとポニーが並んで佇む横長のメイン写真。サイト最上部いっぱいに使用。"
            sourceHint="horserest.jp トップページの放牧シーン、bajigaku.net の馬とのふれあいカット"
            aspect="wide"
            className="border-cream/30 bg-cream/5"
          />
        </div>
      </section>

      {/* Concept teaser */}
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <ImagePlaceholder
            label="施設全景"
            description="キャンピングカーサイトとフリーサイト、ポニーパドックが見渡せる俯瞰写真。"
            sourceHint="引退馬の森／horserest.jp の牧場全景写真の雰囲気"
            aspect="square"
          />
          <div>
            <SectionHeading
              eyebrow="Concept"
              title="馬と、人と、緑と。ゆっくり流れる時間を。"
              description="Retouch Horse Gardenは、キャンピングカーサイトとフリーサイトを備えた小さなホースキャンプ場です。馬たちの暮らす牧場のすぐそばで一晩を過ごし、日常から離れてゆったりとした時間を味わっていただけます。1日4組限定だからこそ実現できる、静かで濃密な滞在体験です。"
            />
            <LinkButton href="/about" variant="ghost">
              施設コンセプトをもっと見る →
            </LinkButton>
          </div>
        </div>
      </Section>

      {/* Story: retired horse support */}
      <Section tone="forest">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="ここでの一泊が、引退馬たちの新しい居場所をつくる。"
              description="競走馬としての役目を終えた馬たちは、その後の人生をどう過ごすか、大きな課題を抱えています。Retouch Horse Gardenは、引退馬支援活動「Retouch」とつながる体験型施設。皆さまの宿泊料の一部が、引退馬たちの飼養・リトレーニング費用として活用されます。"
            />
            <LinkButton
              href="/retouch"
              variant="secondary"
              className="border-cream text-cream hover:bg-cream hover:text-forest-dark"
            >
              Retouchの取り組みを見る →
            </LinkButton>
          </div>
          <ImagePlaceholder
            label="引退馬とスタッフ"
            description="引退馬を優しくケアするスタッフの様子。物語性が伝わる情緒的な一枚。"
            sourceHint="retouch.salon / retouch.news に掲載されている引退馬支援活動の写真"
            aspect="video"
            className="border-cream/30 bg-cream/5"
          />
        </div>
      </Section>

      {/* Experiences grid */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Experience"
          title="馬と過ごす、4つの体験"
          description="ポニーとのふれあいから、餌やり、写真撮影、BBQまで。滞在中はさまざまな体験オプションをお選びいただけます。"
          align="center"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EXPERIENCES.map((exp) => (
            <div key={exp.title} className="flex flex-col gap-4">
              <ImagePlaceholder
                label={exp.title}
                description={exp.desc}
                sourceHint={exp.hint}
                aspect="square"
              />
              <div>
                <h3 className="font-serif text-base font-semibold text-forest-dark">
                  {exp.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-charcoal-soft">{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <LinkButton href="/experience" variant="secondary">
            体験の詳細を見る
          </LinkButton>
        </div>
      </Section>

      {/* Sites teaser */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="Stay"
          title="2種類の滞在スタイル"
          description="愛車でそのまま宿泊できるキャンピングカーサイトと、テント派に人気のフリーサイトをご用意しています。"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <ImagePlaceholder
              label="キャンピングカーサイト"
              description="電源付きサイトに停まったキャンピングカーと、隣接するポニーパドックの様子。"
              aspect="video"
              className="rounded-none border-0"
            />
            <div className="p-6">
              <h3 className="font-serif text-lg font-semibold text-forest-dark">
                キャンピングカーサイト
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                電源付き・愛車のキャンピングカーやトレーラーでそのまま宿泊。ポニーパドックのすぐそばで過ごせます。
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <ImagePlaceholder
              label="フリーサイト"
              description="芝生の上にテントとタープを設営し、焚き火を楽しむゲストの様子。"
              aspect="video"
              className="rounded-none border-0"
            />
            <div className="p-6">
              <h3 className="font-serif text-lg font-semibold text-forest-dark">フリーサイト</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                テント・タープを自由に設営できる芝生サイト。焚き火をしながら牧場の夜を満喫できます。
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <LinkButton href="/sites" variant="secondary">
            サイトの詳細を見る
          </LinkButton>
          <LinkButton href="/pricing" variant="ghost">
            料金案内を見る →
          </LinkButton>
        </div>
      </Section>

      {/* Reviews (live from Supabase) */}
      {reviews.length > 0 && (
        <Section tone="white">
          <SectionHeading eyebrow="Voice" title="ゲストの声" align="center" />
          <div className="grid gap-6 sm:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-2xl bg-cream p-6 shadow-sm">
                {review.rating && (
                  <p className="mb-2 text-terracotta">{"★".repeat(review.rating)}</p>
                )}
                <p className="text-sm leading-relaxed text-charcoal-soft">{review.content}</p>
                <p className="mt-4 text-xs font-medium text-forest-dark">{review.display_name}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Final CTA */}
      <Section tone="forest">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
            1日4組限定。空いているうちにご予約ください。
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-cream/80">
            ご希望日の空き状況はご予約ページからすぐに確認できます。ご不明な点はお問い合わせフォームからお気軽にどうぞ。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <LinkButton href="/booking" variant="primary">
              予約ページへ進む
            </LinkButton>
            <Link
              href="/faq"
              className="text-sm text-cream/80 underline underline-offset-4 hover:text-cream"
            >
              よくある質問を見る
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
