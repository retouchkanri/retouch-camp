import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = { title: "引退馬支援活動とのつながり" };

export default function RetouchPage() {
  return (
    <>
      <section className="bg-forest-dark text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs tracking-[0.2em] text-terracotta uppercase">Retouch</p>
          <h1 className="max-w-2xl font-serif text-3xl leading-snug font-semibold sm:text-4xl">
            引退馬支援活動「Retouch」との、つながり
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
            Retouch Horse Gardenは、引退馬支援活動「Retouch」の運営母体が手がける体験型施設です。ここでの一泊が、そのまま馬たちの未来を支える力になります。
          </p>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <ImagePlaceholder
            label="引退馬支援活動の様子"
            description="引退馬のケアやリトレーニングを行うスタッフ・関係者の写真。"
            sourceHint="retouch.salon / retouch.news 掲載の活動写真"
            aspect="video"
          />
          <div>
            <SectionHeading
              eyebrow="What is Retouch"
              title="競走馬に、次の人生を。"
              description="毎年多くの競走馬が現役を退きます。Retouchは、そうした引退馬たちが安心して暮らせる場所を作り、乗馬やセラピーホースなど新たな役割へとつなげる支援活動です。Retouch Horse Gardenは、この活動を多くの方に知っていただくための入り口として運営しています。"
            />
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeading eyebrow="How it works" title="宿泊料が支援につながる仕組み" align="center" />
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { step: "01", title: "宿泊・体験に参加する", desc: "Retouch Horse Gardenでの一泊や体験オプションをお申し込みいただきます。" },
            { step: "02", title: "料金の一部が活動費に", desc: "宿泊料・体験料の一部が、引退馬の飼養費やリトレーニング費用として活用されます。" },
            { step: "03", title: "引退馬の未来につながる", desc: "支援を受けた馬たちは、乗馬やセラピーホースなど新しい役割で第二の馬生を歩みます。" },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="font-serif text-3xl font-semibold text-terracotta/60">{s.step}</p>
              <h3 className="mt-3 font-serif text-lg font-semibold text-forest-dark">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Learn more" title="Retouchの活動をもっと知る" />
        <div className="grid gap-6 sm:grid-cols-2">
          <a
            href="https://retouch.salon/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-sage/30 bg-cream p-6 transition-colors hover:border-terracotta"
          >
            <p className="font-serif text-base font-semibold text-forest-dark">Retouch Salon</p>
            <p className="mt-2 text-sm text-charcoal-soft">
              Retouchの活動拠点・サロンについて詳しくご紹介しています。
            </p>
            <p className="mt-3 text-xs text-terracotta">retouch.salon ↗</p>
          </a>
          <a
            href="https://retouch.news/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-sage/30 bg-cream p-6 transition-colors hover:border-terracotta"
          >
            <p className="font-serif text-base font-semibold text-forest-dark">Retouch News</p>
            <p className="mt-2 text-sm text-charcoal-soft">
              引退馬支援活動の最新ニュース・取り組みを発信しています。
            </p>
            <p className="mt-3 text-xs text-terracotta">retouch.news ↗</p>
          </a>
        </div>
      </Section>
    </>
  );
}
