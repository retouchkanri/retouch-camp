"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
};

export function UserMenu() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      setProfile(data);
    }

    loadProfile();

    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName = profile?.full_name?.trim() || "ゲスト";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full py-1 pr-1 pl-1 transition-colors hover:bg-sage/10"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="max-w-[8rem] truncate text-sm text-charcoal">{displayName}</span>
        <span className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-sage/20">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-base text-sage">🐴</span>
          )}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-sage/20 bg-white py-1 shadow-lg"
        >
          <Link
            href="/mypage"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-charcoal transition-colors hover:bg-cream-dark hover:text-terracotta"
          >
            マイページ
          </Link>
          <Link
            href="/mypage#profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-charcoal transition-colors hover:bg-cream-dark hover:text-terracotta"
          >
            プロフィール編集
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="block w-full px-4 py-2.5 text-left text-sm text-charcoal transition-colors hover:bg-cream-dark hover:text-terracotta"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
