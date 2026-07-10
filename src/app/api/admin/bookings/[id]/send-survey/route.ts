import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { sendSurveyForBooking } from "@/lib/survey";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const { id } = await params;
  try {
    const { sent } = await sendSurveyForBooking(id);
    if (!sent) {
      return NextResponse.json(
        { error: "メールを送信できませんでした。メール設定をご確認ください。" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("send-survey failed", err);
    return NextResponse.json({ error: "アンケートの送信に失敗しました。" }, { status: 500 });
  }
}
