import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";

const UpdateUserSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  role: z.enum(["admin", "staff", "customer"]).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requester = await getAdminUser();
  if (!requester) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = UpdateUserSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "入力内容をご確認ください。" }, { status: 400 });

  if (id === requester.id && parsed.data.role && parsed.data.role !== "admin") {
    return NextResponse.json({ error: "自分自身の権限は変更できません。" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("profiles").update(parsed.data).eq("id", id);
  if (error) return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requester = await getAdminUser();
  if (!requester) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const { id } = await params;
  if (id === requester.id) {
    return NextResponse.json({ error: "自分自身のアカウントは削除できません。" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: "削除に失敗しました。" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
