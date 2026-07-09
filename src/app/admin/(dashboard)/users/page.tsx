import Link from "next/link";
import { listAllProfiles } from "@/lib/admin-users";
import { getAdminUser } from "@/lib/admin-auth";
import { UserRoleSelect } from "@/components/admin/UserRoleSelect";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";

export default async function AdminUsersPage() {
  const [profiles, requester] = await Promise.all([listAllProfiles(), getAdminUser()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest-dark">ユーザー管理</h1>
          <p className="text-sm text-charcoal-soft">全{profiles.length}件</p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white hover:bg-terracotta-dark"
        >
          ユーザーを追加
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-sage/10 text-charcoal-soft">
            <tr>
              <th className="px-5 py-3 font-medium">ユーザー</th>
              <th className="px-5 py-3 font-medium">メール</th>
              <th className="px-5 py-3 font-medium">権限</th>
              <th className="px-5 py-3 font-medium">登録日</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/10">
            {profiles.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-sage/20">
                      {p.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-sage">
                          🐴
                        </div>
                      )}
                    </div>
                    <span className="text-forest-dark">{p.full_name || "(未設定)"}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-charcoal-soft">{p.email}</td>
                <td className="px-5 py-3">
                  <UserRoleSelect userId={p.id} role={p.role} disabled={p.id === requester?.id} />
                </td>
                <td className="px-5 py-3 text-charcoal-soft">
                  {new Date(p.created_at).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-5 py-3 text-right">
                  <DeleteUserButton userId={p.id} disabled={p.id === requester?.id} />
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-charcoal-soft">
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
