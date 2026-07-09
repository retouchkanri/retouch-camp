import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
  full_name: z.string().min(1).max(100),
  role: z.enum(["admin", "staff", "customer"]),
});

export async function POST(request: Request) {
  const requester = await getAdminUser();
  if (!requester) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = CreateUserSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容をご確認ください。" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.full_name },
    app_metadata: { role: parsed.data.role },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message === "User already registered" ? "このメールアドレスは既に登録されています。" : "作成に失敗しました。" },
      { status: 400 },
    );
  }

  // The handle_new_user trigger already inserted a profiles row from app_metadata;
  // make sure the role matches even if metadata handling ever changes.
  await supabase
    .from("profiles")
    .update({ role: parsed.data.role, full_name: parsed.data.full_name, email: parsed.data.email })
    .eq("id", data.user.id);

  return NextResponse.json({ ok: true, id: data.user.id }, { status: 201 });
}
