import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getBookingByCancelToken } from "@/lib/booking";
import { STATUS_LABEL_JA } from "@/lib/booking-labels";
import { CancelBookingButton } from "@/components/sections/CancelBookingButton";

export const metadata: Metadata = { title: "予約内容の確認・キャンセル" };

export default async function BookingCancelPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const booking = await getBookingByCancelToken(token);

  if (!booking) notFound();

  const canCancel = booking.status === "pending" || booking.status === "approved";

  return (
    <Section tone="cream" className="min-h-[60vh]">
      <div className="mx-auto max-w-xl">
        <SectionHeading eyebrow="Your Booking" title="ご予約内容の確認" />
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-sage/10 py-2">
              <dt className="text-charcoal-soft">お名前</dt>
              <dd className="font-medium text-forest-dark">{booking.customer_name}</dd>
            </div>
            <div className="flex justify-between border-b border-sage/10 py-2">
              <dt className="text-charcoal-soft">ステータス</dt>
              <dd className="font-medium text-forest-dark">{STATUS_LABEL_JA[booking.status]}</dd>
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

          <div className="mt-6 border-t border-sage/10 pt-6">
            {canCancel ? (
              <CancelBookingButton token={token} />
            ) : (
              <p className="text-sm text-charcoal-soft">
                この予約は{STATUS_LABEL_JA[booking.status]}のため、キャンセルできません。
              </p>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
