import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "お問い合わせ" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="お問い合わせ"
        description="ご予約に関するご質問、体験内容についてのご相談など、お気軽にお問い合わせください。"
      />

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
