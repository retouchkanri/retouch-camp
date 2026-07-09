export const MAIN_NAV = [
  { href: "/about", label: "施設コンセプト" },
  { href: "/experience", label: "馬と過ごす体験" },
  { href: "/sites", label: "サイト案内" },
  { href: "/rules", label: "安全ルール" },
  { href: "/pricing", label: "料金案内" },
  { href: "/access", label: "アクセス" },
  { href: "/retouch", label: "引退馬支援とのつながり" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export const FACILITY_NAME = "Retouch Horse Garden";
export const FACILITY_NAME_JA = "リタッチ・ホースガーデン";
export const FACILITY_TAGLINE = "一泊が、引退馬の未来につながる。";
export const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL ?? "";
