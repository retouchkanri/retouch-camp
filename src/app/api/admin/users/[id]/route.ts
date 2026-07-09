import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";
import { getAdminUserById } from "@/lib/admin-users";

const UpdateUserSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  role: z.enum(["admin", "staff", "customer"]).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(72).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requester = await getAdminUser();
  if (!requester) return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });

  const { id } = await params;
  const user = await getAdminUserById(id);
  if (!user) return NextResponse.json({ error: "ユーザーが見つかりません。" }, { status: 404 });

  return NextResponse.json({ user });
}

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
  const { data: authData } = await supabase.auth.admin.getUserById(id);
  if (!authData.user) {
    return NextResponse.json({ error: "ユーザーが見つかりません。" }, { status: 404 });
  }

  const authUpdate: {
    email?: string;
    password?: string;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  } = {};

  if (parsed.data.email) authUpdate.email = parsed.data.email;
  if (parsed.data.password) authUpdate.password = parsed.data.password;
  if (parsed.data.full_name) {
    authUpdate.user_metadata = {
      ...authData.user.user_metadata,
      full_name: parsed.data.full_name,
    };
  }
  if (parsed.data.role) {
    authUpdate.app_metadata = {
      ...authData.user.app_metadata,
      role: parsed.data.role,
    };
  }

  if (Object.keys(authUpdate).length > 0) {
    const { error: authError } = await supabase.auth.admin.updateUserById(id, authUpdate);
    if (authError) {
      return NextResponse.json(
        { error: authError.message.includes("already") ? "このメールアドレスは既に登録されています。" : "更新に失敗しました。" },
        { status: 400 },
      );
    }
  }

  const profileUpdate: Record<string, string> = {};
  if (parsed.data.full_name) profileUpdate.full_name = parsed.data.full_name;
  if (parsed.data.role) profileUpdate.role = parsed.data.role;
  if (parsed.data.email) profileUpdate.email = parsed.data.email;

  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await supabase.from("profiles").update(profileUpdate).eq("id", id);
    if (error) return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });
  }

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
