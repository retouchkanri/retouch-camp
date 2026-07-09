"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function CancelBookingButton({ token }: { token: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCancel() {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/bookings/${token}/cancel`, { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "キャンセルに失敗しました。");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "キャンセルに失敗しました。");
    }
  }

  if (!confirming) {
    return (
      <Button variant="secondary" onClick={() => setConfirming(true)}>
        この予約をキャンセルする
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-charcoal-soft">
        本当にキャンセルしますか？キャンセルポリシーによっては料金が発生する場合があります。
      </p>
      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
      <div className="flex gap-3">
        <Button onClick={handleCancel} disabled={status === "submitting"}>
          {status === "submitting" ? "処理中…" : "はい、キャンセルします"}
        </Button>
        <Button variant="ghost" type="button" onClick={() => setConfirming(false)}>
          もどる
        </Button>
      </div>
    </div>
  );
}
