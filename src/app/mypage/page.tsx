import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getCurrentProfile, getBookingsForUser } from "@/lib/account";
import { STATUS_LABEL_JA, STATUS_BADGE_CLASS } from "@/lib/booking-labels";
import { AvatarUpload } from "@/components/account/AvatarUpload";
import { ProfileNameForm } from "@/components/account/ProfileNameForm";
import { LogoutButton } from "@/components/account/LogoutButton";
import Link from "next/link";

export const metadata: Metadata = { title: "マイページ" };

export default async function MyPage() {
  const current = await getCurrentProfile();
  if (!current) redirect("/login?next=/mypage");

  const bookings = await getBookingsForUser(current.userId, current.profile.email || "");

  return (
    <Section tone="cream" className="min-h-[70vh]">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <SectionHeading eyebrow="My Page" title="マイページ" />
          <LogoutButton />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-base font-semibold text-forest-dark">プロフィール</h2>
          <div className="mt-4">
            <AvatarUpload userId={current.userId} avatarUrl={current.profile.avatar_url} />
          </div>
          <div className="mt-6">
            <ProfileNameForm initialName={current.profile.full_name || ""} />
          </div>
          <p className="mt-4 text-xs text-charcoal-soft">メールアドレス: {current.profile.email}</p>
        </div>

        <div>
          <h2 className="mb-4 font-serif text-base font-semibold text-forest-dark">ご予約履歴</h2>
          {bookings.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-sm text-charcoal-soft shadow-sm">
              まだご予約がありません。
              <div className="mt-4">
                <Link href="/booking" className="text-terracotta underline">
                  予約ページへ
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/booking/cancel/${b.cancel_token}`}
                  className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="font-medium text-forest-dark">
                      {new Date(b.stay_date).toLocaleDateString("ja-JP")}（{b.nights}泊）
                    </p>
                    <p className="text-sm text-charcoal-soft">{b.site_type?.name_ja}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-terracotta">
                      {b.total_price.toLocaleString()}円
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[b.status]}`}
                    >
                      {STATUS_LABEL_JA[b.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
