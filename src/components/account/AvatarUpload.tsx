"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function AvatarUpload({ userId, avatarUrl }: { userId: string; avatarUrl: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setErrorMsg("画像ファイルを選択してください。");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setStatus("error");
      setErrorMsg("ファイルサイズは5MB以下にしてください。");
      return;
    }

    setStatus("uploading");
    setErrorMsg("");

    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setStatus("error");
      setErrorMsg(
        `アップロードに失敗しました（Storageバケット未作成の可能性があります: ${uploadError.message}）`,
      );
      return;
    }

    const res = await fetch("/api/account/avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    const body = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(body.error || "更新に失敗しました。");
      return;
    }

    setPreview(body.avatar_url);
    setStatus("idle");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-sage/20">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="アバター" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-sage">🐴</div>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className="rounded-2xl border border-sage/40 px-4 py-2 text-sm text-forest-dark hover:border-terracotta"
        >
          {status === "uploading" ? "アップロード中…" : "画像を変更"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {status === "error" && <p className="mt-2 text-xs text-red-600">{errorMsg}</p>}
      </div>
    </div>
  );
}
