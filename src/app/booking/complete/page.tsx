import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { getBookingByCancelToken } from "@/lib/booking";
import { STATUS_LABEL_JA } from "@/lib/booking-labels";

export const metadata: Metadata = { title: "予約申し込み完了" };

export default async function BookingCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const booking = token ? await getBookingByCancelToken(token) : null;

  return (
    <Section tone="cream" className="min-h-[60vh]">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs tracking-[0.2em] text-terracotta uppercase">Thank you</p>
        <h1 className="mt-3 font-serif text-2xl font-semibold text-forest-dark sm:text-3xl">
          ご予約のお申し込みありがとうございます
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">
          内容を確認のうえ、運営スタッフより承認のご連絡をいたします（通常1〜2営業日以内）。ご登録のメールアドレスに確認メールをお送りしました。
        </p>

        {booking && (
          <div className="mt-8 rounded-2xl bg-white p-6 text-left shadow-sm">
            <SectionHeading title="お申し込み内容" />
            <dl className="-mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-b border-sage/10 py-2">
                <dt className="text-charcoal-soft">ステータス</dt>
                <dd className="font-medium text-forest-dark">
                  {STATUS_LABEL_JA[booking.status]}
                </dd>
              </div>
              <div className="flex justify-between border-b border-sage/10 py-2">
                <dt className="text-charcoal-soft">宿泊日</dt>
                <dd className="font-medium text-forest-dark">
                  {new Date(booking.stay_date).toLocaleDateString("ja-JP")}（{booking.nights}泊）
                </dd>
              </div>
              <div className="flex justify-between border-b border-sage/10 py-2">
                <dt className="text-charcoal-soft">サイト</dt>
                <dd className="font-medium text-forest-dark">{booking.site_type?.name_ja}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-charcoal-soft">お支払い予定金額</dt>
                <dd className="font-semibold text-terracotta">
                  {booking.total_price.toLocaleString()}円
                </dd>
              </div>
            </dl>
            <Link
              href={`/booking/cancel/${booking.cancel_token}`}
              className="mt-4 inline-block text-xs text-charcoal-soft underline"
            >
              予約内容の確認・キャンセルはこちら
            </Link>
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {booking && (
            <LinkButton href={`/booking/payment/${booking.cancel_token}`} variant="primary">
              お支払いについて
            </LinkButton>
          )}
          <LinkButton href="/" variant="secondary">
            トップページへ戻る
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
