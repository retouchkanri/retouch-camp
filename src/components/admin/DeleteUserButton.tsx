"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteUserButton({ userId, disabled }: { userId: string; disabled?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("このユーザーを削除しますか？この操作は取り消せません。")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        alert((await res.json()).error || "削除に失敗しました。");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (disabled) return null;

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className="text-xs text-red-600 hover:underline disabled:opacity-50"
    >
      削除
    </button>
  );
}
