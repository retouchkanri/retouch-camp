"use client";

import { Button } from "@/components/ui/Button";
import type { Booking } from "@/types/database";

const HEADERS = [
  "宿泊日", "ステータス", "お客様名", "メール", "電話", "地域", "利用形態",
  "大人", "子供", "乳幼児", "金額", "利用目的", "来場きっかけ", "リピート意向",
];

function toCsvRow(values: (string | number)[]) {
  return values.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
}

const STATUS_LABEL: Record<string, string> = {
  pending: "承認待ち",
  approved: "承認済み",
  rejected: "却下",
  cancelled: "キャンセル",
};

export function CsvExportButton({ bookings, filename }: { bookings: Booking[]; filename: string }) {
  function handleExport() {
    const rows = bookings.map((b) =>
      toCsvRow([
        b.stay_date,
        STATUS_LABEL[b.status] ?? b.status,
        b.customer_name,
        b.customer_email,
        b.customer_phone || "",
        b.region || "",
        b.group_type || "",
        b.num_adults,
        b.num_children,
        b.num_infants,
        b.total_price,
        b.purpose || "",
        b.referral_source || "",
        b.repeat_intention || "",
      ]),
    );
    const csv = ["﻿" + toCsvRow(HEADERS), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="secondary" onClick={handleExport} disabled={bookings.length === 0}>
      CSVでダウンロード
    </Button>
  );
}
