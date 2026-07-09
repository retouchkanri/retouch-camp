import Link from "next/link";
import { MAIN_NAV, FACILITY_NAME, FACILITY_NAME_JA, FACILITY_TAGLINE } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="mt-auto bg-forest-dark text-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-semibold">{FACILITY_NAME}</p>
          <p className="text-xs tracking-wide text-cream/60">{FACILITY_NAME_JA}</p>
          <p className="mt-4 text-sm leading-relaxed text-cream/80">{FACILITY_TAGLINE}</p>
          <p className="mt-4 text-xs leading-relaxed text-cream/60">
            大阪府河内長野市｜1日4組限定の完全予約制ホースキャンプ
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-cream/90">サイトメニュー</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-cream/70">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-terracotta">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-cream/90">運営</p>
          <p className="text-sm leading-relaxed text-cream/70">
            Retouch Horse Gardenは、引退馬支援活動「Retouch」の運営母体が手がける
            体験型ホースキャンプ施設です。
          </p>
          <Link
            href="/retouch"
            className="mt-3 inline-block text-sm text-terracotta hover:text-terracotta-dark"
          >
            引退馬支援活動について →
          </Link>
          <Link
            href="/admin/login"
            className="mt-4 block text-xs text-cream/40 hover:text-cream/70"
          >
            運営者ログイン
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Retouch Horse Garden. All rights reserved.
      </div>
    </footer>
  );
}
