"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MAIN_NAV, FACILITY_NAME, FACILITY_NAME_JA } from "@/lib/nav";
import { createClient } from "@/lib/supabase/client";
import { UserMenu } from "./UserMenu";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-sage/20 bg-cream/95 backdrop-blur">
      <div className="flex w-full items-center justify-between px-[5vw] py-4">
        <Link href="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
          <span className="font-serif text-lg font-semibold text-forest-dark sm:text-xl">
            {FACILITY_NAME}
          </span>
          <span className="text-[11px] tracking-wide text-charcoal-soft">{FACILITY_NAME_JA}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-terracotta ${
                pathname === item.href ? "font-semibold text-terracotta" : "text-charcoal"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {loggedIn ? (
            <UserMenu />
          ) : (
            <Link
              href="/login"
              className="text-sm text-charcoal transition-colors hover:text-terracotta"
            >
              ログイン
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {loggedIn && <UserMenu />}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-sage/40"
            aria-label="メニューを開く"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              {open ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-sage/20 bg-cream lg:hidden">
          <nav className="flex flex-col gap-1 px-[5vw] py-4">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm ${
                  pathname === item.href
                    ? "bg-forest/10 font-semibold text-terracotta"
                    : "text-charcoal"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {!loggedIn && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-charcoal"
              >
                ログイン
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
