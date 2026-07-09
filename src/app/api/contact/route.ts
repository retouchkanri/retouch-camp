import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, emailLayout } from "@/lib/email";

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(1).max(4000),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = ContactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容をご確認ください。" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    })
    .select("id")
    .single();

  if (error) {
    console.error("contact insert failed", error);
    return NextResponse.json({ error: "送信に失敗しました。時間をおいて再度お試しください。" }, { status: 500 });
  }

  const { data: settingRow } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact_email")
    .single();
  const adminEmail = (settingRow?.value as string) || undefined;

  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `【お問い合わせ】${parsed.data.subject || parsed.data.name}様より`,
      html: emailLayout(
        "新しいお問い合わせ",
        `<p><strong>お名前:</strong> ${parsed.data.name}</p>
         <p><strong>メール:</strong> ${parsed.data.email}</p>
         <p><strong>電話:</strong> ${parsed.data.phone || "-"}</p>
         <p><strong>件名:</strong> ${parsed.data.subject || "-"}</p>
         <p><strong>内容:</strong><br/>${parsed.data.message.replace(/\n/g, "<br/>")}</p>`,
      ),
    });
  }

  await sendEmail({
    to: parsed.data.email,
    subject: "【Retouch Horse Garden】お問い合わせありがとうございます",
    html: emailLayout(
      "お問い合わせを受け付けました",
      `<p>${parsed.data.name} 様</p>
       <p>お問い合わせいただきありがとうございます。内容を確認のうえ、担当より折り返しご連絡いたします。</p>`,
    ),
  });

  return NextResponse.json({ id: data.id }, { status: 201 });
}
