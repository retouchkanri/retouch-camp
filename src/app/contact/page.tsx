import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = { title: "お問い合わせ" };

export default function ContactPage() {
  return (
    <>
      <section className="bg-forest-dark text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs tracking-[0.2em] text-terracotta uppercase">Contact</p>
          <h1 className="max-w-2xl font-serif text-3xl leading-snug font-semibold sm:text-4xl">
            お問い合わせ
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
            ご予約に関するご質問、体験内容についてのご相談など、お気軽にお問い合わせください。
          </p>
        </div>
      </section>

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              title="お問い合わせフォーム"
              description="通常1〜2営業日以内にご返信いたします。お急ぎの場合はお電話にてご連絡ください。"
            />
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
