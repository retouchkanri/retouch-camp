import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { BookingForm } from "@/components/sections/BookingForm";
import { getActiveSiteTypes, getActiveExperienceOptions } from "@/lib/booking";
import { getCurrentProfile } from "@/lib/account";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "ご予約" };

export default async function BookingPage() {
  const [siteTypes, options, current] = await Promise.all([
    getActiveSiteTypes(),
    getActiveExperienceOptions(),
    getCurrentProfile(),
  ]);

  return (
    <>
      <section className="bg-forest-dark text-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-xs tracking-[0.2em] text-terracotta uppercase">Booking</p>
          <h1 className="max-w-2xl font-serif text-3xl leading-snug font-semibold sm:text-4xl">
            ご予約
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
            1日4組限定・完全予約制です。お申し込み後、運営スタッフが内容を確認し承認いたします。
          </p>
        </div>
      </section>

      <Section tone="cream">
        <div className="mx-auto max-w-2xl">
          {siteTypes.length === 0 ? (
            <p className="rounded-2xl bg-white p-8 text-sm text-charcoal-soft shadow-sm">
              現在ご予約を受け付けておりません。しばらくしてから再度お試しください。
              <br />
              <span className="text-xs text-charcoal-soft/70">
                （管理者向け: Supabaseに site_types のデータが見つかりません。supabase/migrations/0001_init.sql
                を適用してください）
              </span>
            </p>
          ) : (
            <BookingForm
              siteTypes={siteTypes}
              options={options}
              initialName={current?.profile.full_name || ""}
              initialEmail={current?.profile.email || ""}
            />
          )}
        </div>
      </Section>
    </>
  );
}
