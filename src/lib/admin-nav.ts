export const ADMIN_NAV = [
  { href: "/admin", label: "概要", exact: true },
  { href: "/admin/bookings", label: "予約一覧" },
  { href: "/admin/calendar", label: "予約カレンダー" },
  { href: "/admin/surveys", label: "アンケート結果" },
  { href: "/admin/reviews", label: "口コミ管理" },
  { href: "/admin/reports", label: "月次レポート" },
  { href: "/admin/users", label: "ユーザー管理" },
] as const;
