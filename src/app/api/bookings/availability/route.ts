import { NextResponse } from "next/server";
import { getAvailabilityForDate } from "@/lib/booking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date=YYYY-MM-DD を指定してください。" }, { status: 400 });
  }

  const availability = await getAvailabilityForDate(date);
  return NextResponse.json(availability);
}
