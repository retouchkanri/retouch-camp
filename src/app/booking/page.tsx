import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { BookingForm } from "@/components/sections/BookingForm";
import { getActiveSiteTypes, getActiveExperienceOptions } from "@/lib/booking";
import { getCurrentProfile } from "@/lib/account";
import { PageHero } from "@/components/layout/PageHero";

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
      <PageHero
        eyebrow="Booking"
        title="ご予約"
        description="1日4組限定・完全予約制です。お申し込み後、運営スタッフが内容を確認し承認いたします。"
        compact
      />

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
