import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
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
    title: "ポニーのお手入れ体験",
    desc: "ブラッシングなどのお手入れを通じて、ポニーのお世話を体験できます。",
    hint: "ゲストがスタッフと一緒にポニーをお手入れする様子",
  },
  {
    title: "馬の写真撮影",
    desc: "馬たちと過ごした瞬間を、写真に残します。",
    hint: "bajigaku.net のような馬とゲストのポートレート風カット",
  },
  {
    title: "バーベキュー",
    desc: "牧場の空気の中、緑に囲まれてゆったり味わうバーベキュー。",
    hint: "BBQグリルと夕暮れの牧場風景",
  },
  {
    title: "星空を眺めながらのんびり過ごす時間",
    desc: "夜は、静かな牧場で星空を眺めながらのんびりと。",
    hint: "夜のサイトから見上げる星空と、シルエットになった馬たち",
  },
];

async function getPublishedReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) return [];

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
      <section className="relative overflow-hidden bg-mist">
        <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-4 inline-block rounded-2xl border border-terracotta/60 px-4 py-1 font-serif text-xs tracking-[0.2em] text-terracotta uppercase">
              1日4組限定・完全予約制
            </p>
            <h1 className="font-serif text-3xl leading-snug font-semibold text-forest-dark sm:text-4xl lg:text-5xl">
              馬と過ごす、
              <br />
              小さな休日。
            </h1>
            <p className="mt-4 font-serif text-sm tracking-wide text-forest-dark">
              大阪府河内長野市・千葉県八街市。
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal-soft sm:text-base">
              ここは、大きなキャンプ場ではありません。
              <br />
              1日4組限定。真ん中にはポニーたちがのんびり暮らす放牧場。その周りに、小さな宿泊サイトが並びます。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <LinkButton href="/booking" variant="primary">
                空き状況を見て予約する
              </LinkButton>
              <LinkButton href="/about" variant="secondary">
                施設コンセプトを見る
              </LinkButton>
            </div>
          </div>

          <ImagePlaceholder
            label="ヒーロービジュアル"
            description="緑の牧場を背景に、ゲストとポニーが並んで佇む横長のメイン写真。サイト最上部いっぱいに使用。"
            sourceHint="horserest.jp トップページの放牧シーン、bajigaku.net の馬とのふれあいカット"
            aspect="wide"
          />
        </div>
      </section>

      {/* Concept teaser */}
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <ImagePlaceholder
            label="施設全景"
            description="中央のポニー放牧場と、それを囲むキャンピングカーサイト・フリーサイトが見渡せる俯瞰写真。"
            sourceHint="引退馬の森／horserest.jp の牧場全景写真の雰囲気"
            aspect="square"
          />
          <div>
            <SectionHeading
              eyebrow="Concept"
              title="馬を眺めながら、泊まる。"
              description="馬を眺めながらコーヒーを飲む。ゆっくり散歩をする。家族や仲間とバーベキューを楽しむ。ただそれだけの時間が、少し特別な思い出になります。キャンプでもない。牧場でもない。馬と過ごす新しい休日。静かに馬と過ごす滞在型施設です。"
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
              title="あなたの一泊が、引退馬の未来につながる。"
              description="Retouchは、引退競走馬たちの命をつなぐ活動を行っています。私たちは、引退競走馬やポニーたちの新しい活躍の場をつくるため、この小さなホースガーデンをスタートしました。皆さまがここで過ごしてくださる時間が、馬たちの未来を支える力になります。"
            />
            <LinkButton href="/retouch" variant="secondary">
              Retouchの取り組みを見る →
            </LinkButton>
          </div>
          <ImagePlaceholder
            label="引退馬とスタッフ"
            description="引退馬を優しくケアするスタッフの様子。物語性が伝わる情緒的な一枚。"
            sourceHint="retouch.salon / retouch.news に掲載されている引退馬支援活動の写真"
            aspect="video"
          />
        </div>
      </Section>

      {/* Experiences grid */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Experience"
          title="お楽しみいただけること"
          description="ポニーとのふれあい、餌やり体験、ポニーのお手入れ体験、馬の写真撮影、バーベキュー、そして星空を眺めながらのんびり過ごす時間。※安全管理上、焚火・直火は禁止しております。"
          align="center"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          title="1日4組限定・2種類の滞在スタイル"
          description="中央にはポニーたちの放牧場。どのサイトからも、のんびりと過ごすポニーたちの姿を見ることができます。朝、窓を開けると馬たちが草を食べている。そんな贅沢な時間をお楽しみください。"
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <ImagePlaceholder
              label="キャンピングカーサイト"
              description="設置されたご宿泊用キャンピングカーと、中央のポニー放牧場の様子。"
              aspect="video"
              className="rounded-none border-0"
            />
            <div className="p-6">
              <h3 className="font-serif text-lg font-semibold text-forest-dark">
                キャンピングカーサイト（2区画）
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                ご宿泊用キャンピングカーを設置。手軽にアウトドア気分を楽しめます。
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <ImagePlaceholder
              label="フリーサイト"
              description="芝生の上にテントとタープを設営してくつろぐゲストの様子。"
              aspect="video"
              className="rounded-none border-0"
            />
            <div className="p-6">
              <h3 className="font-serif text-lg font-semibold text-forest-dark">
                フリーサイト（2区画）
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                テントやキャンピングカーの持ち込みが可能です。
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
            1日4組だけの、特別なホースガーデン。
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-charcoal-soft">
            ご希望日の空き状況はご予約ページからすぐに確認できます。ご不明な点はお問い合わせフォームからお気軽にどうぞ。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <LinkButton href="/booking" variant="primary">
              予約ページへ進む
            </LinkButton>
            <Link
              href="/faq"
              className="font-serif text-sm text-charcoal-soft underline underline-offset-4 hover:text-terracotta"
            >
              よくある質問を見る
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
