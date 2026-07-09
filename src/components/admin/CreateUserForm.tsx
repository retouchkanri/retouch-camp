"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FieldWrapper, TextInput, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function CreateUserForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password, role }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "作成に失敗しました。");
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "作成に失敗しました。");
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
      <FieldWrapper label="パスワード" htmlFor="password" required hint="6文字以上">
        <TextInput
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper label="権限" htmlFor="role" required>
        <Select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">顧客</option>
          <option value="staff">スタッフ</option>
          <option value="admin">管理者</option>
        </Select>
      </FieldWrapper>
      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "作成中…" : "ユーザーを作成"}
      </Button>
    </form>
  );
}
