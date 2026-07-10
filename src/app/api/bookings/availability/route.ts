import { NextResponse } from "next/server";
import { getAvailabilityForStay } from "@/lib/booking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const nightsParam = searchParams.get("nights");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date=YYYY-MM-DD を指定してください。" }, { status: 400 });
  }

  const nights = nightsParam ? Number.parseInt(nightsParam, 10) : 1;
  if (!Number.isInteger(nights) || nights < 1 || nights > 3) {
    return NextResponse.json({ error: "nights は 1〜3 を指定してください。" }, { status: 400 });
  }

  const availability = await getAvailabilityForStay(date, nights);
  return NextResponse.json(availability);
}
