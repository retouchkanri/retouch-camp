"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FieldWrapper, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "confirm">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(
        error.message === "User already registered"
          ? "このメールアドレスはすでに登録されています。"
          : error.message,
      );
      return;
    }

    if (data.session) {
      router.push("/mypage");
      router.refresh();
      return;
    }

    setStatus("confirm");
  }

  if (status === "confirm") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="font-serif text-lg font-semibold text-forest-dark">
          確認メールをお送りしました
        </p>
        <p className="mt-2 text-sm text-charcoal-soft">
          メール内のリンクをクリックして、登録を完了してください。
        </p>
      </div>
    );
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
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FieldWrapper>
      <FieldWrapper label="パスワード" htmlFor="password" required hint="8文字以上を推奨します">
        <TextInput
          id="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FieldWrapper>
      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "登録中…" : "登録する"}
      </Button>
      <p className="text-center text-sm text-charcoal-soft">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-terracotta underline">
          ログイン
        </Link>
      </p>
    </form>
  );
}
