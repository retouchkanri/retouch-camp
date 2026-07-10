import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import { sendEmail, emailLayout } from "@/lib/email";
import type { Booking, Survey } from "@/types/database";

export async function ensureSurveyForBooking(bookingId: string): Promise<Survey> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("surveys")
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (existing) return existing as Survey;

  const { data: created, error } = await supabase
    .from("surveys")
    .insert({ booking_id: bookingId })
    .select("*")
    .single();

  if (error || !created) throw new Error(error?.message || "survey creation failed");
  return created as Survey;
}

export async function sendSurveyForBooking(bookingId: string) {
  if (!isSupabaseAdminConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  const supabase = createAdminClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();
  if (!booking) throw new Error("booking not found");

  const survey = await ensureSurveyForBooking(bookingId);

  const { sent } = await sendEmail({
    to: (booking as Booking).customer_email,
    subject: "【Retouch Horse Garden】ご滞在はいかがでしたか？アンケートのお願い",
    html: emailLayout(
      "アンケートのお願い",
      `<p>${(booking as Booking).customer_name} 様</p>
       <p>先日はRetouch Horse Gardenにご宿泊いただき、誠にありがとうございました。今後の施設づくりの参考にさせていただきたく、簡単なアンケートにご協力いただけますと幸いです（所要時間約3分）。</p>
       <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/survey/${survey.token}">アンケートに回答する</a></p>`,
    ),
  });

  // Only mark as sent when the email actually went out — otherwise the cron
  // would treat the booking as done and the guest would never get a survey.
  if (sent) {
    await supabase
      .from("surveys")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", survey.id);
  }

  return { survey, sent };
}

export async function getSurveyByToken(token: string) {
  if (!isSupabaseAdminConfigured()) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("surveys")
    .select("*, booking:bookings(*)")
    .eq("token", token)
    .single();
  return data as (Survey & { booking: Booking }) | null;
}

export async function listSurveysWithBookings() {
  if (!isSupabaseAdminConfigured()) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("surveys")
    .select("*, booking:bookings(*)")
    .not("responded_at", "is", null)
    .order("responded_at", { ascending: false });
  return (data as (Survey & { booking: Booking })[]) ?? [];
}
