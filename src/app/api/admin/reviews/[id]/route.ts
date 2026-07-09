import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";

const UpdateSchema = z.object({
  published: z.boolean().optional(),
  content: z.string().min(1).max(1000).optional(),
  display_name: z.string().min(1).max(100).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "入力内容をご確認ください。" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").update(parsed.data).eq("id", id);
  if (error) return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "削除に失敗しました。" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
