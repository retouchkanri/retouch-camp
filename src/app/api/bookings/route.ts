import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  computeOptionQuantity,
  computeTotalPrice,
  getAvailabilityForDate,
} from "@/lib/booking";
import { sendEmail, emailLayout } from "@/lib/email";
import type { ExperienceOption, SiteType } from "@/types/database";

const BookingSchema = z.object({
  stay_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nights: z.number().int().min(1).max(3),
  site_type_id: z.string().uuid(),

  num_adults: z.number().int().min(1).max(8),
  num_children: z.number().int().min(0).max(8),
  num_infants: z.number().int().min(0).max(8),

  customer_name: z.string().min(1).max(100),
  customer_email: z.string().email(),
  customer_phone: z.string().max(30).optional().nullable(),

  region: z.string().max(50).optional().nullable(),
  group_type: z.enum(["family", "couple", "friends", "solo", "other"]).optional().nullable(),
  purpose: z.string().max(200).optional().nullable(),
  desired_experience: z.array(z.string()).default([]),
  stay_style: z.string().max(100).optional().nullable(),
  referral_source: z.string().max(100).optional().nullable(),
  repeat_intention: z.string().max(100).optional().nullable(),

  notes: z.string().max(2000).optional().nullable(),
  option_ids: z.array(z.string().uuid()).default([]),
  agree_rules: z.literal(true),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = BookingSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容をご確認ください。", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const input = parsed.data;

  const today = new Date().toISOString().slice(0, 10);
  if (input.stay_date < today) {
    return NextResponse.json({ error: "過去の日付は選択できません。" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Derived from the request's own session cookie — never trust a client-supplied user id.
  const sessionClient = await createClient();
  const {
    data: { user: sessionUser },
  } = await sessionClient.auth.getUser();

  const availability = await getAvailabilityForDate(input.stay_date);
  if (availability.remaining <= 0) {
    return NextResponse.json(
      { error: "申し訳ございません、選択された日付は満室です。" },
      { status: 409 },
    );
  }

  const { data: siteType, error: siteTypeError } = await supabase
    .from("site_types")
    .select("*")
    .eq("id", input.site_type_id)
    .eq("active", true)
    .single();

  if (siteTypeError || !siteType) {
    return NextResponse.json({ error: "サイト種別が正しくありません。" }, { status: 400 });
  }

  let selectedOptions: ExperienceOption[] = [];
  if (input.option_ids.length > 0) {
    const { data: options } = await supabase
      .from("experience_options")
      .select("*")
      .in("id", input.option_ids)
      .eq("active", true);
    selectedOptions = (options as ExperienceOption[]) ?? [];
  }

  const totalPrice = computeTotalPrice(
    siteType as SiteType,
    input.nights,
    selectedOptions,
    input.num_adults,
    input.num_children,
  );

  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      stay_date: input.stay_date,
      nights: input.nights,
      site_type_id: input.site_type_id,
      num_adults: input.num_adults,
      num_children: input.num_children,
      num_infants: input.num_infants,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone || null,
      region: input.region || null,
      group_type: input.group_type || null,
      purpose: input.purpose || null,
      desired_experience: input.desired_experience,
      stay_style: input.stay_style || null,
      referral_source: input.referral_source || null,
      repeat_intention: input.repeat_intention || null,
      notes: input.notes || null,
      total_price: totalPrice,
      status: "pending",
      user_id: sessionUser?.id || null,
    })
    .select("*")
    .single();

  if (insertError || !booking) {
    console.error("booking insert failed", insertError);
    return NextResponse.json({ error: "予約の作成に失敗しました。" }, { status: 500 });
  }

  if (selectedOptions.length > 0) {
    const rows = selectedOptions.map((opt) => ({
      booking_id: booking.id,
      option_id: opt.id,
      quantity: computeOptionQuantity(opt, input.num_adults, input.num_children),
      unit_price: opt.price,
    }));
    const { error: optionsError } = await supabase.from("booking_options").insert(rows);
    if (optionsError) console.error("booking_options insert failed", optionsError);
  }

  const { data: settingRow } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact_email")
    .single();
  const adminEmail = settingRow?.value as string | undefined;

  const dateLabel = new Date(input.stay_date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await sendEmail({
    to: input.customer_email,
    subject: "【Retouch Horse Garden】ご予約申し込みを受け付けました",
    html: emailLayout(
      "ご予約申し込みを受け付けました",
      `<p>${input.customer_name} 様</p>
       <p>この度はご予約のお申し込みをいただき、ありがとうございます。内容を確認のうえ、運営スタッフより承認のご連絡をいたします（通常1〜2営業日以内）。</p>
       <p><strong>宿泊日:</strong> ${dateLabel}（${input.nights}泊）<br/>
       <strong>サイト:</strong> ${siteType.name_ja}<br/>
       <strong>人数:</strong> 大人${input.num_adults}名 / 子供${input.num_children}名 / 乳幼児${input.num_infants}名<br/>
       <strong>お支払い予定金額:</strong> ${totalPrice.toLocaleString()}円</p>
       <p>ご予約内容の確認・キャンセルは下記のページから行えます。</p>
       <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/booking/cancel/${booking.cancel_token}">予約内容の確認・キャンセルはこちら</a></p>`,
    ),
  });

  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `【新規予約申込】${input.customer_name}様 ${dateLabel}`,
      html: emailLayout(
        "新しい予約申し込みがあります",
        `<p><strong>お名前:</strong> ${input.customer_name}（${input.customer_email}）</p>
         <p><strong>宿泊日:</strong> ${dateLabel}（${input.nights}泊）</p>
         <p><strong>サイト:</strong> ${siteType.name_ja}</p>
         <p><strong>人数:</strong> 大人${input.num_adults} / 子供${input.num_children} / 乳幼児${input.num_infants}</p>
         <p><strong>金額:</strong> ${totalPrice.toLocaleString()}円</p>
         <p>管理画面から承認してください。</p>`,
      ),
    });
  }

  return NextResponse.json(
    { id: booking.id, cancel_token: booking.cancel_token, total_price: totalPrice },
    { status: 201 },
  );
}
