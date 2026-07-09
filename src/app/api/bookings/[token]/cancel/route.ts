import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, emailLayout } from "@/lib/email";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("cancel_token", token)
    .single();

  if (!booking) {
    return NextResponse.json({ error: "予約が見つかりませんでした。" }, { status: 404 });
  }

  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "この予約はすでにキャンセル済みです。" }, { status: 400 });
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", booking.id);

  if (error) {
    return NextResponse.json({ error: "キャンセル処理に失敗しました。" }, { status: 500 });
  }

  const dateLabel = new Date(booking.stay_date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await sendEmail({
    to: booking.customer_email,
    subject: "【Retouch Horse Garden】ご予約をキャンセルしました",
    html: emailLayout(
      "ご予約のキャンセルを承りました",
      `<p>${booking.customer_name} 様</p>
       <p>${dateLabel} のご予約をキャンセルいたしました。またのご利用を心よりお待ちしております。</p>`,
    ),
  });

  return NextResponse.json({ ok: true });
}
