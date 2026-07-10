import Link from "next/link";
import { MAIN_NAV, FACILITY_TAGLINE } from "@/lib/nav";
import { SiteLogoLink } from "./SiteLogo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gold/30 bg-mist text-forest-dark">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <SiteLogoLink className="h-12 w-auto sm:h-14" />
          <p className="mt-4 font-serif text-sm leading-relaxed text-forest-dark/90">
            {FACILITY_TAGLINE}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-charcoal-soft">
            大阪府河内長野市｜1日4組限定の完全予約制ホースキャンプ
          </p>
        </div>

        <div>
          <p className="mb-3 font-serif text-sm font-semibold text-forest-dark">サイトメニュー</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 font-serif text-sm text-charcoal-soft">
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
          <p className="mb-3 font-serif text-sm font-semibold text-forest-dark">運営</p>
          <p className="text-sm leading-relaxed text-charcoal-soft">
            Retouch Horse Gardenは、引退馬支援活動「Retouch」の運営母体が手がける
            体験型ホースキャンプ施設です。
          </p>
          <Link
            href="/retouch"
            className="mt-3 inline-block font-serif text-sm text-terracotta hover:text-terracotta-dark"
          >
            引退馬支援活動について →
          </Link>
          <Link
            href="/admin/login"
            className="mt-4 block text-xs text-charcoal-soft/60 hover:text-charcoal-soft"
          >
            運営者ログイン
          </Link>
        </div>
      </div>

      <div className="border-t border-gold/20 py-5 text-center text-xs text-charcoal-soft/70">
        © {new Date().getFullYear()} Retouch Horse Garden. All rights reserved.
      </div>
    </footer>
  );
}
