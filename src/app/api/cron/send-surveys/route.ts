import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSurveyForBooking } from "@/lib/survey";
import type { Booking } from "@/types/database";

/**
 * Sends the post-stay satisfaction survey for every approved booking whose
 * checkout date has passed and that hasn't been sent one yet. Intended to be
 * invoked once a day by an external scheduler (Vercel Cron, Supabase cron, etc.)
 * — see README for setup. Protect with CRON_SECRET so this can't be spammed publicly.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const queryToken = new URL(request.url).searchParams.get("secret");
    const bearerToken = request.headers.get("authorization")?.replace("Bearer ", "");
    if (queryToken !== secret && bearerToken !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: approvedBookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("status", "approved")
    .lte("stay_date", today);

  const candidates = ((approvedBookings as Booking[]) ?? []).filter((b) => {
    const checkout = new Date(b.stay_date);
    checkout.setDate(checkout.getDate() + b.nights);
    return checkout.toISOString().slice(0, 10) <= today;
  });

  if (candidates.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const { data: existingSurveys } = await supabase
    .from("surveys")
    .select("booking_id, sent_at")
    .in(
      "booking_id",
      candidates.map((b) => b.id),
    );

  const alreadySent = new Set(
    (existingSurveys ?? []).filter((s) => s.sent_at).map((s) => s.booking_id),
  );

  const toSend = candidates.filter((b) => !alreadySent.has(b.id));

  let sent = 0;
  for (const booking of toSend) {
    try {
      await sendSurveyForBooking(booking.id);
      sent += 1;
    } catch (err) {
      console.error(`send-survey failed for booking ${booking.id}`, err);
    }
  }

  return NextResponse.json({ sent, checked: candidates.length });
}
