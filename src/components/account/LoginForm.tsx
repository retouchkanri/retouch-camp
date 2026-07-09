"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FieldWrapper, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setErrorMsg(
        error.message === "Invalid login credentials"
          ? "メールアドレスまたはパスワードが正しくありません。"
          : error.message,
      );
      return;
    }

    router.push(searchParams.get("next") || "/mypage");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-sm">
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
      <FieldWrapper label="パスワード" htmlFor="password" required>
        <TextInput
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FieldWrapper>
      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "ログイン中…" : "ログイン"}
      </Button>
      <p className="text-center text-sm text-charcoal-soft">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="text-terracotta underline">
          新規登録
        </Link>
      </p>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense>
      <LoginFormInner />
    </Suspense>
  );
}
