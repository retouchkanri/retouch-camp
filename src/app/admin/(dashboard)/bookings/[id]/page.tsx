import { notFound } from "next/navigation";
import { getBookingById } from "@/lib/booking";
import { STATUS_LABEL_JA, STATUS_BADGE_CLASS, GROUP_TYPE_LABEL_JA } from "@/lib/booking-labels";
import { BookingActions } from "@/components/admin/BookingActions";
import { SendSurveyButton } from "@/components/admin/SendSurveyButton";
import type { GroupType } from "@/types/database";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest-dark">
            {booking.customer_name} 様のご予約
          </h1>
          <p className="text-sm text-charcoal-soft">
            {new Date(booking.stay_date).toLocaleDateString("ja-JP")}（{booking.nights}泊）
          </p>
        </div>
        <span
          className={`rounded-2xl px-4 py-1.5 text-sm font-medium ${STATUS_BADGE_CLASS[booking.status]}`}
        >
          {STATUS_LABEL_JA[booking.status]}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-serif text-base font-semibold text-forest-dark">宿泊内容</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-charcoal-soft">サイト</dt>
              <dd className="text-forest-dark">{booking.site_type?.name_ja}</dd>
              <dt className="text-charcoal-soft">人数</dt>
              <dd className="text-forest-dark">
                大人{booking.num_adults} / 子供{booking.num_children} / 乳幼児{booking.num_infants}
              </dd>
              <dt className="text-charcoal-soft">お支払い予定金額</dt>
              <dd className="font-semibold text-terracotta">
                {booking.total_price.toLocaleString()}円
              </dd>
              <dt className="text-charcoal-soft">体験オプション</dt>
              <dd className="text-forest-dark">
                {booking.booking_options && booking.booking_options.length > 0
                  ? booking.booking_options
                      .map((o) => `${o.experience_option?.name_ja}×${o.quantity}`)
                      .join("、")
                  : "なし"}
              </dd>
            </dl>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-serif text-base font-semibold text-forest-dark">お客様情報</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-charcoal-soft">お名前</dt>
              <dd className="text-forest-dark">{booking.customer_name}</dd>
              <dt className="text-charcoal-soft">メール</dt>
              <dd className="text-forest-dark">{booking.customer_email}</dd>
              <dt className="text-charcoal-soft">電話番号</dt>
              <dd className="text-forest-dark">{booking.customer_phone || "-"}</dd>
              <dt className="text-charcoal-soft">地域</dt>
              <dd className="text-forest-dark">{booking.region || "-"}</dd>
            </dl>
            {booking.notes && (
              <div className="mt-4 border-t border-sage/10 pt-4 text-sm">
                <p className="text-charcoal-soft">ご要望・備考</p>
                <p className="mt-1 text-forest-dark">{booking.notes}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-serif text-base font-semibold text-forest-dark">
              データ収集項目（将来の需要分析用）
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-charcoal-soft">利用形態</dt>
              <dd className="text-forest-dark">
                {booking.group_type ? GROUP_TYPE_LABEL_JA[booking.group_type as GroupType] : "-"}
              </dd>
              <dt className="text-charcoal-soft">利用目的</dt>
              <dd className="text-forest-dark">{booking.purpose || "-"}</dd>
              <dt className="text-charcoal-soft">希望する体験</dt>
              <dd className="text-forest-dark">
                {booking.desired_experience.length > 0
                  ? booking.desired_experience.join("、")
                  : "-"}
              </dd>
              <dt className="text-charcoal-soft">宿泊スタイル</dt>
              <dd className="text-forest-dark">{booking.stay_style || "-"}</dd>
              <dt className="text-charcoal-soft">来場きっかけ</dt>
              <dd className="text-forest-dark">{booking.referral_source || "-"}</dd>
              <dt className="text-charcoal-soft">リピート意向</dt>
              <dd className="text-forest-dark">{booking.repeat_intention || "-"}</dd>
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <BookingActions
            bookingId={booking.id}
            status={booking.status}
            adminMemo={booking.admin_memo}
          />
          {booking.status === "approved" && <SendSurveyButton bookingId={booking.id} />}
          <div className="rounded-2xl bg-white p-6 text-xs text-charcoal-soft shadow-sm">
            <p>予約ID: {booking.id}</p>
            <p className="mt-1">申込日時: {new Date(booking.created_at).toLocaleString("ja-JP")}</p>
            {booking.approved_at && (
              <p className="mt-1">承認日時: {new Date(booking.approved_at).toLocaleString("ja-JP")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
