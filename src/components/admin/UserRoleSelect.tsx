"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types/database";

const ROLE_LABEL: Record<UserRole, string> = {
  admin: "管理者",
  staff: "スタッフ",
  customer: "顧客",
};

export function UserRoleSelect({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: UserRole;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(role);
  const [busy, setBusy] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as UserRole;
    setValue(next);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: next }),
      });
      if (!res.ok) {
        setValue(role);
        alert((await res.json()).error || "更新に失敗しました。");
      } else {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  if (disabled) {
    return <span className="text-sm text-charcoal-soft">{ROLE_LABEL[role]}</span>;
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={busy}
      className="rounded-lg border border-sage/40 bg-white px-2 py-1 text-sm"
    >
      {(Object.keys(ROLE_LABEL) as UserRole[]).map((r) => (
        <option key={r} value={r}>
          {ROLE_LABEL[r]}
        </option>
      ))}
    </select>
  );
}
