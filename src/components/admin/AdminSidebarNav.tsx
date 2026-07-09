"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/admin-nav";

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {ADMIN_NAV.map((item) => {
        const active = "exact" in item && item.exact ? pathname === item.href : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active ? "bg-cream/15 font-semibold text-terracotta" : "text-cream/80 hover:bg-cream/10"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
