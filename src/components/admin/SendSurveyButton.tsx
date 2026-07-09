"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function SendSurveyButton({ bookingId }: { bookingId: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSend() {
    setStatus("sending");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/send-survey`, { method: "POST" });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-serif text-base font-semibold text-forest-dark">アンケート</h2>
      <p className="mt-1 text-xs text-charcoal-soft">
        滞在後アンケートのリンクをお客様にメール送信します。
      </p>
      <Button
        variant="secondary"
        className="mt-3 w-full"
        onClick={handleSend}
        disabled={status === "sending"}
      >
        {status === "sending" ? "送信中…" : status === "sent" ? "送信しました" : "アンケートを送信"}
      </Button>
      {status === "error" && <p className="mt-2 text-xs text-red-600">送信に失敗しました。</p>}
    </div>
  );
}
