"use client";

import { useState, type FormEvent } from "react";
import { FieldWrapper, TextInput, TextArea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "送信に失敗しました。");
      }
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "送信に失敗しました。");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="font-serif text-lg font-semibold text-forest-dark">
          お問い合わせありがとうございます
        </p>
        <p className="mt-2 text-sm text-charcoal-soft">
          内容を確認のうえ、担当より折り返しご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-sm">
      <FieldWrapper label="お名前" htmlFor="name" required>
        <TextInput id="name" name="name" required maxLength={100} />
      </FieldWrapper>
      <FieldWrapper label="メールアドレス" htmlFor="email" required>
        <TextInput id="email" name="email" type="email" required />
      </FieldWrapper>
      <FieldWrapper label="電話番号" htmlFor="phone">
        <TextInput id="phone" name="phone" type="tel" />
      </FieldWrapper>
      <FieldWrapper label="件名" htmlFor="subject">
        <TextInput id="subject" name="subject" maxLength={200} />
      </FieldWrapper>
      <FieldWrapper label="お問い合わせ内容" htmlFor="message" required>
        <TextArea id="message" name="message" required rows={6} maxLength={4000} />
      </FieldWrapper>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "送信中…" : "送信する"}
      </Button>
    </form>
  );
}
