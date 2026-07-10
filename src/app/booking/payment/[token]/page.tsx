import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { getBookingByCancelToken } from "@/lib/booking";
import { STATUS_LABEL_JA } from "@/lib/booking-labels";

export const metadata: Metadata = { title: "お支払いについて" };

export default async function BookingPaymentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const booking = await getBookingByCancelToken(token);

  if (!booking) notFound();

  return (
    <Section tone="cream" className="min-h-[60vh]">
      <div className="mx-auto max-w-xl">
        <SectionHeading eyebrow="Payment" title="お支払いについて" />
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-sage/10 py-2">
              <dt className="text-charcoal-soft">お名前</dt>
              <dd className="font-medium text-forest-dark">{booking.customer_name}</dd>
            </div>
            <div className="flex justify-between border-b border-sage/10 py-2">
              <dt className="text-charcoal-soft">ご予約ステータス</dt>
              <dd className="font-medium text-forest-dark">{STATUS_LABEL_JA[booking.status]}</dd>
            </div>
            <div className="flex justify-between border-b border-sage/10 py-2">
              <dt className="text-charcoal-soft">宿泊日</dt>
              <dd className="font-medium text-forest-dark">
                {new Date(booking.stay_date).toLocaleDateString("ja-JP")}（{booking.nights}泊）
              </dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-charcoal-soft">お支払い予定金額（税込）</dt>
              <dd className="text-lg font-semibold text-terracotta">
                {booking.total_price.toLocaleString()}円
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-xl bg-cream p-5 text-sm leading-relaxed text-charcoal-soft">
            <p className="font-medium text-forest-dark">お支払い方法</p>
            <p className="mt-2">
              現在、オンライン決済はご利用いただけません。上記の金額は、ご来場当日に現地にてお支払いください（現金・一部QR決済対応予定）。
            </p>
            {booking.status === "pending" && (
              <p className="mt-2">
                なお、ご予約はまだ承認待ちです。運営スタッフの承認後、確定のご連絡をお送りします。
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <LinkButton href={`/booking/cancel/${token}`} variant="secondary">
            予約内容の確認に戻る
          </LinkButton>
          <LinkButton href="/" variant="ghost">
            トップページへ戻る
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
