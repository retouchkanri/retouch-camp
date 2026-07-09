import type { BookingStatus, GroupType } from "@/types/database";

export const STATUS_LABEL_JA: Record<BookingStatus, string> = {
  pending: "承認待ち",
  approved: "承認済み",
  rejected: "却下",
  cancelled: "キャンセル済み",
};

export const STATUS_BADGE_CLASS: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-600",
};

export const GROUP_TYPE_LABEL_JA: Record<GroupType, string> = {
  family: "家族",
  couple: "カップル・夫婦",
  friends: "友人グループ",
  solo: "ソロ",
  other: "その他",
};
