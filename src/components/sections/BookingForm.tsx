"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FieldWrapper, TextInput, TextArea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import {
  PREFECTURES,
  GROUP_TYPES,
  PURPOSES,
  DESIRED_EXPERIENCES,
  STAY_STYLES,
  REFERRAL_SOURCES,
  REPEAT_INTENTIONS,
} from "@/lib/booking-constants";
import type { ExperienceOption, SiteType } from "@/types/database";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingForm({
  siteTypes,
  options,
  initialName = "",
  initialEmail = "",
}: {
  siteTypes: SiteType[];
  options: ExperienceOption[];
  initialName?: string;
  initialEmail?: string;
}) {
  const router = useRouter();

  const [stayDate, setStayDate] = useState("");
  const [nights, setNights] = useState(1);
  const [siteTypeId, setSiteTypeId] = useState(siteTypes[0]?.id ?? "");
  const [numAdults, setNumAdults] = useState(2);
  const [numChildren, setNumChildren] = useState(0);
  const [numInfants, setNumInfants] = useState(0);
  const [optionIds, setOptionIds] = useState<string[]>([]);

  const [customerName, setCustomerName] = useState(initialName);
  const [customerEmail, setCustomerEmail] = useState(initialEmail);
  const [customerPhone, setCustomerPhone] = useState("");

  const [region, setRegion] = useState("");
  const [groupType, setGroupType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [desiredExperience, setDesiredExperience] = useState<string[]>([]);
  const [stayStyle, setStayStyle] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [repeatIntention, setRepeatIntention] = useState("");
  const [notes, setNotes] = useState("");
  const [agreeRules, setAgreeRules] = useState(false);

  const [availability, setAvailability] = useState<{ remaining: number; max: number } | null>(
    null,
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!stayDate) return;
    let cancelled = false;
    fetch(`/api/bookings/availability?date=${stayDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAvailability(data);
      })
      .catch(() => {
        if (!cancelled) setAvailability(null);
      });
    return () => {
      cancelled = true;
    };
  }, [stayDate]);

  const selectedSiteType = siteTypes.find((s) => s.id === siteTypeId);
  const selectedOptions = options.filter((o) => optionIds.includes(o.id));

  const totalPrice = useMemo(() => {
    if (!selectedSiteType) return 0;
    const siteTotal = selectedSiteType.price_per_night * nights;
    const optionsTotal = selectedOptions.reduce((sum, opt) => {
      const qty = opt.unit === "per_person" ? Math.max(1, numAdults + numChildren) : 1;
      return sum + opt.price * qty;
    }, 0);
    return siteTotal + optionsTotal;
  }, [selectedSiteType, nights, selectedOptions, numAdults, numChildren]);

  function toggleOption(id: string) {
    setOptionIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  function toggleDesired(label: string) {
    setDesiredExperience((prev) =>
      prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    if (availability && availability.remaining <= 0) {
      setStatus("error");
      setErrorMsg("申し訳ございません、選択された日付は満室です。別の日程をお選びください。");
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stay_date: stayDate,
          nights,
          site_type_id: siteTypeId,
          num_adults: numAdults,
          num_children: numChildren,
          num_infants: numInfants,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone || null,
          region: region || null,
          group_type: groupType || null,
          purpose: purpose || null,
          desired_experience: desiredExperience,
          stay_style: stayStyle || null,
          referral_source: referralSource || null,
          repeat_intention: repeatIntention || null,
          notes: notes || null,
          option_ids: optionIds,
          agree_rules: agreeRules,
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "予約の送信に失敗しました。");

      router.push(`/booking/complete?token=${body.cancel_token}`);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "予約の送信に失敗しました。");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      {/* Stay details */}
      <fieldset className="flex flex-col gap-5">
        <h2 className="font-serif text-lg font-semibold text-forest-dark">1. 宿泊内容</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="宿泊日" htmlFor="stay_date" required>
            <TextInput
              id="stay_date"
              type="date"
              required
              min={todayISO()}
              value={stayDate}
              onChange={(e) => setStayDate(e.target.value)}
            />
          </FieldWrapper>
          <FieldWrapper label="泊数" htmlFor="nights" required>
            <Select id="nights" value={nights} onChange={(e) => setNights(Number(e.target.value))}>
              <option value={1}>1泊</option>
              <option value={2}>2泊</option>
              <option value={3}>3泊</option>
            </Select>
          </FieldWrapper>
        </div>

        {stayDate && availability && (
          <p
            className={`text-sm ${availability.remaining > 0 ? "text-forest" : "text-red-600"}`}
          >
            {availability.remaining > 0
              ? `この日はあと${availability.remaining}組ご予約いただけます（1日${availability.max}組限定）`
              : "申し訳ございません、この日は満室です。別の日程をお選びください。"}
          </p>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-forest-dark">サイト種別 *</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {siteTypes.map((site) => (
              <label
                key={site.id}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 text-sm transition-colors ${
                  siteTypeId === site.id
                    ? "border-terracotta bg-terracotta/5"
                    : "border-sage/30 bg-white"
                }`}
              >
                <span className="flex items-center gap-2 font-medium text-forest-dark">
                  <input
                    type="radio"
                    name="site_type"
                    value={site.id}
                    checked={siteTypeId === site.id}
                    onChange={() => setSiteTypeId(site.id)}
                  />
                  {site.name_ja}
                </span>
                <span className="text-charcoal-soft">{site.description}</span>
                <span className="font-semibold text-terracotta">
                  {site.price_per_night.toLocaleString()}円 / 泊
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <FieldWrapper label="大人" htmlFor="num_adults" required>
            <TextInput
              id="num_adults"
              type="number"
              min={1}
              max={8}
              required
              value={numAdults}
              onChange={(e) => setNumAdults(Number(e.target.value))}
            />
          </FieldWrapper>
          <FieldWrapper label="子供（小学生〜）" htmlFor="num_children">
            <TextInput
              id="num_children"
              type="number"
              min={0}
              max={8}
              value={numChildren}
              onChange={(e) => setNumChildren(Number(e.target.value))}
            />
          </FieldWrapper>
          <FieldWrapper label="乳幼児" htmlFor="num_infants">
            <TextInput
              id="num_infants"
              type="number"
              min={0}
              max={8}
              value={numInfants}
              onChange={(e) => setNumInfants(Number(e.target.value))}
            />
          </FieldWrapper>
        </div>
      </fieldset>

      {/* Options */}
      <fieldset className="flex flex-col gap-4">
        <h2 className="font-serif text-lg font-semibold text-forest-dark">2. 体験オプション</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${
                optionIds.includes(opt.id) ? "border-terracotta bg-terracotta/5" : "border-sage/30 bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={optionIds.includes(opt.id)}
                onChange={() => toggleOption(opt.id)}
                className="mt-1"
              />
              <span>
                <span className="block font-medium text-forest-dark">{opt.name_ja}</span>
                <span className="block text-charcoal-soft">{opt.description}</span>
                <span className="block font-semibold text-terracotta">
                  {opt.price > 0
                    ? `${opt.price.toLocaleString()}円 ${opt.unit === "per_person" ? "/ 人" : "/ 組"}`
                    : "無料"}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Customer info */}
      <fieldset className="flex flex-col gap-5">
        <h2 className="font-serif text-lg font-semibold text-forest-dark">3. お客様情報</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWrapper label="お名前" htmlFor="customer_name" required>
            <TextInput
              id="customer_name"
              required
              maxLength={100}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </FieldWrapper>
          <FieldWrapper label="メールアドレス" htmlFor="customer_email" required>
            <TextInput
              id="customer_email"
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </FieldWrapper>
          <FieldWrapper label="電話番号" htmlFor="customer_phone">
            <TextInput
              id="customer_phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </FieldWrapper>
          <FieldWrapper label="お住まいの地域" htmlFor="region">
            <Select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </FieldWrapper>
        </div>
      </fieldset>

      {/* Data collection */}
      <fieldset className="flex flex-col gap-6">
        <div>
          <h2 className="font-serif text-lg font-semibold text-forest-dark">4. 今回の旅について</h2>
          <p className="text-xs text-charcoal-soft">
            今後の施設づくりの参考にさせていただきます。答えられる範囲でご記入ください。
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-forest-dark">ご利用形態</p>
          <div className="flex flex-wrap gap-3">
            {GROUP_TYPES.map((g) => (
              <label
                key={g.value}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${
                  groupType === g.value
                    ? "border-terracotta bg-terracotta/10 text-terracotta-dark"
                    : "border-sage/30 text-charcoal-soft"
                }`}
              >
                <input
                  type="radio"
                  name="group_type"
                  value={g.value}
                  className="sr-only"
                  checked={groupType === g.value}
                  onChange={() => setGroupType(g.value)}
                />
                {g.label}
              </label>
            ))}
          </div>
        </div>

        <FieldWrapper label="利用目的" htmlFor="purpose">
          <Select id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option value="">選択してください</option>
            {PURPOSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </FieldWrapper>

        <div>
          <p className="mb-2 text-sm font-medium text-forest-dark">興味のある体験（複数選択可）</p>
          <div className="flex flex-wrap gap-3">
            {DESIRED_EXPERIENCES.map((label) => (
              <label
                key={label}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${
                  desiredExperience.includes(label)
                    ? "border-terracotta bg-terracotta/10 text-terracotta-dark"
                    : "border-sage/30 text-charcoal-soft"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={desiredExperience.includes(label)}
                  onChange={() => toggleDesired(label)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-forest-dark">宿泊スタイル</p>
          <div className="flex flex-col gap-2">
            {STAY_STYLES.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-charcoal-soft">
                <input
                  type="radio"
                  name="stay_style"
                  checked={stayStyle === s}
                  onChange={() => setStayStyle(s)}
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        <FieldWrapper label="ご来場のきっかけ" htmlFor="referral_source">
          <Select
            id="referral_source"
            value={referralSource}
            onChange={(e) => setReferralSource(e.target.value)}
          >
            <option value="">選択してください</option>
            {REFERRAL_SOURCES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </FieldWrapper>

        <div>
          <p className="mb-2 text-sm font-medium text-forest-dark">またのご利用について</p>
          <div className="flex flex-wrap gap-3">
            {REPEAT_INTENTIONS.map((r) => (
              <label
                key={r.value}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${
                  repeatIntention === r.value
                    ? "border-terracotta bg-terracotta/10 text-terracotta-dark"
                    : "border-sage/30 text-charcoal-soft"
                }`}
              >
                <input
                  type="radio"
                  name="repeat_intention"
                  className="sr-only"
                  checked={repeatIntention === r.value}
                  onChange={() => setRepeatIntention(r.value)}
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>

        <FieldWrapper label="ご要望・備考" htmlFor="notes">
          <TextArea
            id="notes"
            rows={4}
            maxLength={2000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </FieldWrapper>
      </fieldset>

      {/* Summary + submit */}
      <div className="rounded-2xl bg-forest-dark p-6 text-cream">
        <div className="flex items-center justify-between">
          <span className="text-sm text-cream/80">お支払い予定金額（税込）</span>
          <span className="font-serif text-2xl font-semibold">{totalPrice.toLocaleString()}円</span>
        </div>
        <p className="mt-1 text-xs text-cream/60">お支払いは当日現地にてお願いいたします。</p>
      </div>

      <label className="flex items-start gap-3 text-sm text-charcoal-soft">
        <input
          type="checkbox"
          required
          checked={agreeRules}
          onChange={(e) => setAgreeRules(e.target.checked)}
          className="mt-1"
        />
        <span>
          <a href="/rules" target="_blank" className="text-terracotta underline">
            安全ルール
          </a>
          に同意のうえ、予約を申し込みます。 *
        </span>
      </label>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? "送信中…" : "この内容で予約を申し込む"}
      </Button>
      <p className="text-xs text-charcoal-soft">
        ※お申し込み後、運営スタッフが内容を確認し承認いたします。承認まで予約は確定しませんので、あらかじめご了承ください。
      </p>
    </form>
  );
}
