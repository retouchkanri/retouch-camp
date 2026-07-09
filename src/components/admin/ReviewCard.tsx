"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { Review } from "@/types/database";

export function ReviewCard({ review }: { review: Review }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !review.published }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("この口コミを削除しますか？")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          {review.rating && <p className="text-terracotta">{"★".repeat(review.rating)}</p>}
          <p className="mt-2 text-sm text-charcoal-soft">{review.content}</p>
          <p className="mt-3 text-xs font-medium text-forest-dark">{review.display_name}</p>
        </div>
        <span
          className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            review.published ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
          }`}
        >
          {review.published ? "公開中" : "非公開"}
        </span>
      </div>
      <div className="mt-4 flex gap-3">
        <Button variant="secondary" onClick={toggle} disabled={busy}>
          {review.published ? "非公開にする" : "公開する"}
        </Button>
        <Button variant="ghost" onClick={remove} disabled={busy}>
          削除
        </Button>
      </div>
    </div>
  );
}
