import type { UserRole } from "@/types/database";

export const ROLE_LABEL_JA: Record<UserRole, string> = {
  admin: "管理者",
  staff: "スタッフ",
  customer: "顧客",
};

export const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-800",
  staff: "bg-blue-100 text-blue-800",
  customer: "bg-gray-100 text-gray-700",
};

export const ACCOUNT_STATUS_LABEL = {
  active: "アクティブ",
  banned: "停止中",
} as const;

export const ACCOUNT_STATUS_BADGE_CLASS = {
  active: "bg-green-100 text-green-800",
  banned: "bg-red-100 text-red-800",
} as const;
