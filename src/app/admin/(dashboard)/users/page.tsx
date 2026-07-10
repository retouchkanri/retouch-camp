import Link from "next/link";
import { listAllAdminUsers } from "@/lib/admin-users";
import { getAdminUser } from "@/lib/admin-auth";
import { UserRoleSelect } from "@/components/admin/UserRoleSelect";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { AccountStatusBadge, RoleBadge } from "@/components/admin/UserStatusBadge";
import type { UserRole } from "@/types/database";

const ROLE_TABS: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "admin", label: "管理者" },
  { value: "staff", label: "スタッフ" },
  { value: "customer", label: "顧客" },
];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const activeRole = role as UserRole | undefined;
  const [users, requester] = await Promise.all([
    listAllAdminUsers(activeRole),
    getAdminUser(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest-dark">ユーザー管理</h1>
          <p className="text-sm text-charcoal-soft">全{users.length}件</p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-2xl bg-terracotta px-5 py-2.5 text-sm font-medium text-white hover:bg-terracotta-dark"
        >
          ユーザーを追加
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {ROLE_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "all" ? "/admin/users" : `/admin/users?role=${tab.value}`}
            className={`rounded-2xl border px-4 py-1.5 text-sm ${
              (activeRole ?? "all") === tab.value
                ? "border-terracotta bg-terracotta/10 text-terracotta-dark"
                : "border-sage/30 text-charcoal-soft"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-sage/10 text-charcoal-soft">
            <tr>
              <th className="px-5 py-3 font-medium">ユーザー</th>
              <th className="px-5 py-3 font-medium">メール</th>
              <th className="px-5 py-3 font-medium">権限</th>
              <th className="px-5 py-3 font-medium">ステータス</th>
              <th className="px-5 py-3 font-medium">最終ログイン</th>
              <th className="px-5 py-3 font-medium">登録日</th>
              <th className="px-5 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/10">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-cream/50">
                <td className="px-5 py-3">
                  <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3">
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-sage/20">
                      {user.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-sage">
                          🐴
                        </div>
                      )}
                    </div>
                    <span className="text-forest-dark hover:text-terracotta">
                      {user.full_name || "(未設定)"}
                    </span>
                  </Link>
                </td>
                <td className="px-5 py-3 text-charcoal-soft">{user.email}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-col gap-2">
                    <RoleBadge role={user.role} />
                    <UserRoleSelect
                      userId={user.id}
                      role={user.role}
                      disabled={user.id === requester?.id}
                    />
                  </div>
                </td>
                <td className="px-5 py-3">
                  <AccountStatusBadge
                    banned={user.banned}
                    emailConfirmed={user.email_confirmed}
                  />
                </td>
                <td className="px-5 py-3 text-charcoal-soft">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString("ja-JP")
                    : "—"}
                </td>
                <td className="px-5 py-3 text-charcoal-soft">
                  {new Date(user.created_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-xs text-terracotta hover:underline"
                    >
                      編集
                    </Link>
                    <DeleteUserButton userId={user.id} disabled={user.id === requester?.id} />
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-charcoal-soft">
                  ユーザーがいません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
