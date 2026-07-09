import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ProfileSchema = z.object({
  full_name: z.string().min(1).max(100),
});

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = ProfileSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "入力内容をご確認ください。" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ full_name: parsed.data.full_name })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
