"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FieldWrapper, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { FACILITY_NAME } from "@/lib/nav";

function LoginForm() {
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

    router.push(searchParams.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-dark px-5 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-cream p-8 shadow-xl">
        <p className="text-xs tracking-[0.2em] text-terracotta uppercase">Admin</p>
        <h1 className="mt-2 font-serif text-xl font-semibold text-forest-dark">
          {FACILITY_NAME} 管理画面
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
          <Button type="submit" disabled={status === "submitting"} className="mt-2 w-full">
            {status === "submitting" ? "ログイン中…" : "ログイン"}
          </Button>
        </form>
        <p className="mt-6 text-xs text-charcoal-soft">
          管理者アカウントの発行はSupabaseダッシュボード（Authentication）から行ってください。
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
