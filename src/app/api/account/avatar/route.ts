import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const AvatarSchema = z.object({ path: z.string().min(1) });

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = AvatarSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "入力内容をご確認ください。" }, { status: 400 });

  // Only allow pointing a profile at a file inside that user's own storage folder.
  if (!parsed.data.path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: publicUrl } = admin.storage.from("avatars").getPublicUrl(parsed.data.path);

  const { error } = await admin
    .from("profiles")
    .update({ avatar_url: publicUrl.publicUrl })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });
  return NextResponse.json({ ok: true, avatar_url: publicUrl.publicUrl });
}
