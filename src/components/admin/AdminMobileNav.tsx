"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/admin-nav";

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-sage/20 bg-white px-5 py-3 md:hidden">
      {ADMIN_NAV.map((item) => {
        const active = "exact" in item && item.exact ? pathname === item.href : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-shrink-0 rounded-2xl border px-3 py-1.5 text-xs ${
              active ? "border-terracotta bg-terracotta/10 text-terracotta-dark" : "border-sage/30 text-charcoal-soft"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
