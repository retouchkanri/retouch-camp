import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { deriveTags, summarize } from "@/lib/survey-analysis";

const SurveySchema = z.object({
  satisfaction_score: z.number().int().min(1).max(5),
  memorable_experience: z.string().max(2000).optional().nullable(),
  improvement_points: z.string().max(2000).optional().nullable(),
  revisit_intention: z.string().max(200).optional().nullable(),
  review_ok: z.boolean().default(false),
  review_text: z.string().max(1000).optional().nullable(),
  large_facility_wishes: z.string().max(2000).optional().nullable(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const json = await request.json().catch(() => null);
  const parsed = SurveySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容をご確認ください。" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: survey } = await supabase
    .from("surveys")
    .select("*, booking:bookings(*)")
    .eq("token", token)
    .single();

  if (!survey) return NextResponse.json({ error: "アンケートが見つかりませんでした。" }, { status: 404 });
  if (survey.responded_at) {
    return NextResponse.json({ error: "このアンケートはすでに回答済みです。" }, { status: 400 });
  }

  const tags = deriveTags(
    parsed.data.memorable_experience,
    parsed.data.improvement_points,
    parsed.data.large_facility_wishes,
  );
  const aiSummary = summarize(parsed.data.memorable_experience, parsed.data.improvement_points);

  const { error } = await supabase
    .from("surveys")
    .update({
      responded_at: new Date().toISOString(),
      satisfaction_score: parsed.data.satisfaction_score,
      memorable_experience: parsed.data.memorable_experience || null,
      improvement_points: parsed.data.improvement_points || null,
      revisit_intention: parsed.data.revisit_intention || null,
      review_ok: parsed.data.review_ok,
      review_text: parsed.data.review_text || null,
      large_facility_wishes: parsed.data.large_facility_wishes || null,
      ai_summary: aiSummary,
      ai_tags: tags,
    })
    .eq("id", survey.id);

  if (error) {
    console.error("survey update failed", error);
    return NextResponse.json({ error: "送信に失敗しました。" }, { status: 500 });
  }

  if (parsed.data.review_ok && parsed.data.review_text) {
    await supabase.from("reviews").insert({
      survey_id: survey.id,
      booking_id: survey.booking_id,
      display_name: survey.booking?.customer_name || "ゲスト",
      content: parsed.data.review_text,
      rating: parsed.data.satisfaction_score,
      published: false,
    });
  }

  return NextResponse.json({ ok: true });
}
