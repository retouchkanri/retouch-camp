import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*, site_type:site_types(*), booking_options(*, experience_option:experience_options(*))")
    .eq("cancel_token", token)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "予約が見つかりませんでした。" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
