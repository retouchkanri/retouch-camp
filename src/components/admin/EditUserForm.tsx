"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FieldWrapper, TextInput, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { AdminUserRecord } from "@/lib/admin-users";
import type { UserRole } from "@/types/database";

export function EditUserForm({
  user,
  isSelf,
}: {
  user: AdminUserRecord;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(user.full_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState<UserRole>(user.role);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const payload: Record<string, string> = {
      full_name: fullName,
      email,
      role,
    };
    if (password.trim()) {
      payload.password = password;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error || "更新に失敗しました。");
      setPassword("");
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "更新に失敗しました。");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-sm">
      <FieldWrapper label="お名前" htmlFor="full_name" required>
        <TextInput
          id="full_name"
          required
          maxLength={100}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper label="メールアドレス" htmlFor="email" required>
        <TextInput
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper label="権限" htmlFor="role" required>
        <Select
          id="role"
          value={role}
          disabled={isSelf}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="customer">顧客</option>
          <option value="staff">スタッフ</option>
          <option value="admin">管理者</option>
        </Select>
      </FieldWrapper>
      {isSelf && (
        <p className="text-xs text-charcoal-soft">自分自身の権限は変更できません。</p>
      )}
      <FieldWrapper
        label="新しいパスワード"
        htmlFor="password"
        hint="変更しない場合は空欄のままにしてください（6文字以上）"
      >
        <TextInput
          id="password"
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FieldWrapper>
      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "保存中…" : "変更を保存"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/users")}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
