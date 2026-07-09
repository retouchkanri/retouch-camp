import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminUserById } from "@/lib/admin-users";
import { getAdminUser } from "@/lib/admin-auth";
import { EditUserForm } from "@/components/admin/EditUserForm";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { AccountStatusBadge, RoleBadge } from "@/components/admin/UserStatusBadge";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, requester] = await Promise.all([getAdminUserById(id), getAdminUser()]);

  if (!user) notFound();

  const isSelf = id === requester?.id;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/admin/users" className="text-sm text-terracotta hover:text-terracotta-dark">
            ← ユーザー一覧
          </Link>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-forest-dark">
            {user.full_name || "(未設定)"}
          </h1>
          <p className="text-sm text-charcoal-soft">{user.email}</p>
        </div>
        {!isSelf && <DeleteUserButton userId={user.id} />}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs text-charcoal-soft">権限</p>
          <div className="mt-2">
            <RoleBadge role={user.role} />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs text-charcoal-soft">アカウント状態</p>
          <div className="mt-2">
            <AccountStatusBadge banned={user.banned} emailConfirmed={user.email_confirmed} />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs text-charcoal-soft">登録日</p>
          <p className="mt-2 text-sm font-medium text-forest-dark">
            {new Date(user.created_at).toLocaleDateString("ja-JP")}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs text-charcoal-soft">最終ログイン</p>
          <p className="mt-2 text-sm font-medium text-forest-dark">
            {user.last_sign_in_at
              ? new Date(user.last_sign_in_at).toLocaleString("ja-JP")
              : "未ログイン"}
          </p>
        </div>
      </div>

      <div className="max-w-lg">
        <h2 className="mb-4 font-serif text-base font-semibold text-forest-dark">ユーザー情報を編集</h2>
        <EditUserForm user={user} isSelf={isSelf} />
      </div>
    </div>
  );
}
