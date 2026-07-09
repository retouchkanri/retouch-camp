import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";
import { sendEmail, emailLayout } from "@/lib/email";
import { ensureSurveyForBooking } from "@/lib/survey";

const StatusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  admin_memo: z.string().max(2000).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = StatusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容をご確認ください。" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: booking } = await supabase.from("bookings").select("*").eq("id", id).single();
  if (!booking) return NextResponse.json({ error: "予約が見つかりませんでした。" }, { status: 404 });

  const update: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.admin_memo !== undefined) update.admin_memo = parsed.data.admin_memo;
  if (parsed.data.status === "approved") {
    update.approved_at = new Date().toISOString();
    update.approved_by = user.id;
  }

  const { error } = await supabase.from("bookings").update(update).eq("id", id);
  if (error) {
    console.error("booking status update failed", error);
    return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });
  }

  const dateLabel = new Date(booking.stay_date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (parsed.data.status === "approved") {
    await sendEmail({
      to: booking.customer_email,
      subject: "【Retouch Horse Garden】ご予約が確定しました",
      html: emailLayout(
        "ご予約が確定しました",
        `<p>${booking.customer_name} 様</p>
         <p>${dateLabel} のご予約が確定いたしました。当日のお越しを心よりお待ちしております。</p>
         <p>安全ルールを事前にご確認ください。</p>`,
      ),
    });
    // Pre-create the post-stay survey so a send link exists once the stay is over.
    await ensureSurveyForBooking(booking.id).catch((err) => console.error("ensureSurvey failed", err));
  } else if (parsed.data.status === "rejected") {
    await sendEmail({
      to: booking.customer_email,
      subject: "【Retouch Horse Garden】ご予約についてのご連絡",
      html: emailLayout(
        "ご予約について",
        `<p>${booking.customer_name} 様</p>
         <p>誠に恐れ入りますが、${dateLabel} のご予約についてご希望に沿えない状況となりました。詳細はお問い合わせよりご確認ください。</p>`,
      ),
    });
  }

  return NextResponse.json({ ok: true });
}
