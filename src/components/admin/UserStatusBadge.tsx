import {
  ACCOUNT_STATUS_BADGE_CLASS,
  ACCOUNT_STATUS_LABEL,
  ROLE_BADGE_CLASS,
  ROLE_LABEL_JA,
} from "@/lib/user-labels";
import type { UserRole } from "@/types/database";

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`rounded-2xl px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE_CLASS[role]}`}>
      {ROLE_LABEL_JA[role]}
    </span>
  );
}

export function AccountStatusBadge({ banned, emailConfirmed }: { banned: boolean; emailConfirmed: boolean }) {
  if (banned) {
    return (
      <span
        className={`rounded-2xl px-2.5 py-0.5 text-xs font-medium ${ACCOUNT_STATUS_BADGE_CLASS.banned}`}
      >
        {ACCOUNT_STATUS_LABEL.banned}
      </span>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-1">
      <span
        className={`rounded-2xl px-2.5 py-0.5 text-xs font-medium ${ACCOUNT_STATUS_BADGE_CLASS.active}`}
      >
        {ACCOUNT_STATUS_LABEL.active}
      </span>
      {!emailConfirmed && (
        <span className="rounded-2xl bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
          メール未確認
        </span>
      )}
    </span>
  );
}
