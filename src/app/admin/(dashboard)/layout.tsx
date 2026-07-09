import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { FACILITY_NAME } from "@/lib/nav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-forest-dark p-6 text-cream md:flex">
        <Link href="/admin" className="mb-8 block">
          <p className="font-serif text-base font-semibold">{FACILITY_NAME}</p>
          <p className="text-xs text-cream/60">管理画面</p>
        </Link>
        <AdminSidebarNav />
        <div className="mt-auto flex flex-col gap-3 border-t border-cream/10 pt-4">
          <Link href="/" className="text-xs text-cream/60 hover:text-cream">
            ← サイトを見る
          </Link>
          <p className="truncate text-xs text-cream/50">{user?.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-sage/20 bg-white px-5 py-4 md:hidden">
          <p className="font-serif text-sm font-semibold text-forest-dark">{FACILITY_NAME} 管理画面</p>
          <LogoutButton />
        </header>
        <AdminMobileNav />
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
