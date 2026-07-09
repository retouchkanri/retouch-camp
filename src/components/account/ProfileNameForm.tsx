"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FieldWrapper, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ProfileNameForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "更新に失敗しました。");
      setStatus("done");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "更新に失敗しました。");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <FieldWrapper label="お名前" htmlFor="full_name">
          <TextInput
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={100}
            required
          />
        </FieldWrapper>
      </div>
      <Button type="submit" variant="secondary" disabled={status === "submitting"}>
        {status === "submitting" ? "保存中…" : status === "done" ? "保存しました" : "保存"}
      </Button>
      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
    </form>
  );
}
