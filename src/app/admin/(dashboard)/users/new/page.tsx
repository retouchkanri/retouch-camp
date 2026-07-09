import { CreateUserForm } from "@/components/admin/CreateUserForm";

export default function AdminNewUserPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-forest-dark">ユーザーを追加</h1>
        <p className="text-sm text-charcoal-soft">管理者・スタッフ・顧客アカウントを作成します。</p>
      </div>
      <div className="max-w-lg">
        <CreateUserForm />
      </div>
    </div>
  );
}
