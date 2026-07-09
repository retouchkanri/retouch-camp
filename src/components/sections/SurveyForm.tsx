"use client";

import { useState, type FormEvent } from "react";
import { FieldWrapper, TextArea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const REVISIT_OPTIONS = ["ぜひまた行きたい", "機会があれば行きたい", "わからない", "難しい"];

export function SurveyForm({ token }: { token: string }) {
  const [score, setScore] = useState(5);
  const [memorable, setMemorable] = useState("");
  const [improvement, setImprovement] = useState("");
  const [revisit, setRevisit] = useState("");
  const [reviewOk, setReviewOk] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [largeFacilityWishes, setLargeFacilityWishes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/survey/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          satisfaction_score: score,
          memorable_experience: memorable,
          improvement_points: improvement,
          revisit_intention: revisit,
          review_ok: reviewOk,
          review_text: reviewOk ? reviewText : null,
          large_facility_wishes: largeFacilityWishes,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "送信に失敗しました。");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "送信に失敗しました。");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="font-serif text-lg font-semibold text-forest-dark">
          ご回答ありがとうございました
        </p>
        <p className="mt-2 text-sm text-charcoal-soft">
          いただいたご意見は、今後の施設づくりに大切に活用させていただきます。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm">
      <div>
        <p className="mb-2 text-sm font-medium text-forest-dark">総合満足度 *</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setScore(n)}
              className={`h-10 w-10 rounded-full text-sm font-semibold transition-colors ${
                score >= n ? "bg-terracotta text-white" : "bg-cream text-charcoal-soft"
              }`}
              aria-label={`${n}点`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <FieldWrapper label="印象に残った体験" htmlFor="memorable">
        <TextArea id="memorable" rows={3} value={memorable} onChange={(e) => setMemorable(e.target.value)} />
      </FieldWrapper>

      <FieldWrapper label="改善してほしい点" htmlFor="improvement">
        <TextArea
          id="improvement"
          rows={3}
          value={improvement}
          onChange={(e) => setImprovement(e.target.value)}
        />
      </FieldWrapper>

      <div>
        <p className="mb-2 text-sm font-medium text-forest-dark">またのご利用について</p>
        <div className="flex flex-wrap gap-3">
          {REVISIT_OPTIONS.map((opt) => (
            <label
              key={opt}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${
                revisit === opt
                  ? "border-terracotta bg-terracotta/10 text-terracotta-dark"
                  : "border-sage/30 text-charcoal-soft"
              }`}
            >
              <input
                type="radio"
                name="revisit"
                className="sr-only"
                checked={revisit === opt}
                onChange={() => setRevisit(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <FieldWrapper label="将来の大規模施設に期待すること" htmlFor="large_facility_wishes">
        <TextArea
          id="large_facility_wishes"
          rows={3}
          value={largeFacilityWishes}
          onChange={(e) => setLargeFacilityWishes(e.target.value)}
        />
      </FieldWrapper>

      <div className="rounded-xl bg-cream p-4">
        <label className="flex items-start gap-3 text-sm text-charcoal-soft">
          <input
            type="checkbox"
            checked={reviewOk}
            onChange={(e) => setReviewOk(e.target.checked)}
            className="mt-1"
          />
          いただいたご感想を、サイト上の口コミとして掲載してもよろしいですか？
        </label>
        {reviewOk && (
          <div className="mt-3">
            <TextArea
              rows={3}
              placeholder="掲載してもよい範囲でご感想をお書きください"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
        )}
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "送信中…" : "回答する"}
      </Button>
    </form>
  );
}
