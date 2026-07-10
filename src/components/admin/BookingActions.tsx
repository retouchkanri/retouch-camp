"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Field";
import type { BookingStatus } from "@/types/database";

export function BookingActions({
  bookingId,
  status,
  adminMemo,
}: {
  bookingId: string;
  status: BookingStatus;
  adminMemo: string | null;
}) {
  const router = useRouter();
  const [memo, setMemo] = useState(adminMemo || "");
  const [busy, setBusy] = useState<"approve" | "reject" | "memo" | null>(null);
  const [error, setError] = useState("");

  async function updateStatus(next: "approved" | "rejected") {
    setBusy(next === "approved" ? "approve" : "reject");
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next, admin_memo: memo }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "更新に失敗しました。");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました。");
    } finally {
      setBusy(null);
    }
  }

  async function saveMemo() {
    setBusy("memo");
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_memo: memo }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "保存に失敗しました。");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました。");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-serif text-base font-semibold text-forest-dark">運営メモ・対応</h2>
      <TextArea
        rows={3}
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="社内向けメモ（ゲストには表示されません）"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {status === "pending" && (
          <>
            <Button onClick={() => updateStatus("approved")} disabled={busy !== null}>
              {busy === "approve" ? "処理中…" : "承認する"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => updateStatus("rejected")}
              disabled={busy !== null}
            >
              {busy === "reject" ? "処理中…" : "却下する"}
            </Button>
          </>
        )}
        <Button variant="ghost" onClick={saveMemo} disabled={busy !== null}>
          {busy === "memo" ? "保存中…" : "メモを保存"}
        </Button>
      </div>
    </div>
  );
}
