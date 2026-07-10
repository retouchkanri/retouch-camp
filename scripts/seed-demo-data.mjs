// Seeds ~50 example customers (bookings) plus case-study data (post-stay
// survey responses and public reviews) so the admin dashboard has real data
// to demonstrate 予約一覧・売上集計・稼働率・人気日程・人気オプション・
// 顧客属性・アンケート結果・口コミ管理・月次レポート.
//
// Usage: node scripts/seed-demo-data.mjs
//
// Reads NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY from .env.local.
// Writes directly via the service-role client (bypasses the booking API), so
// no confirmation/approval emails are sent. All customers use @example.com
// (RFC 2606 reserved domain) so nothing could ever be delivered even if some
// future code path tried to email them.
//
// Safe to re-run: it counts existing @example.com demo bookings first and
// skips seeding (rather than piling on more) if ~50 or more already exist.

import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const path = new URL("../.env.local", import.meta.url);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] === undefined) {
      process.env[key] = rawValue.replace(/^"(.*)"$/, "$1");
    }
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TOTAL_BOOKINGS = 50;
const MAX_GROUPS_PER_DAY = 4;
const DAY_MS = 86400000;

// All seeded stay dates fall within this window (inclusive) — a clean H1
// 2026 dataset for demoing the dashboard's date-based reporting.
const WINDOW_START = new Date(Date.UTC(2026, 0, 1)); // 2026-01-01
const WINDOW_END = new Date(Date.UTC(2026, 5, 30)); // 2026-06-30

// ---------------------------------------------------------------------------
// Reference data pools (mirrors src/lib/booking-constants.ts)
// ---------------------------------------------------------------------------

const SURNAMES = [
  "佐藤", "鈴木", "高橋", "田中", "伊藤", "渡辺", "山本", "中村", "小林", "加藤",
  "吉田", "山田", "佐々木", "山口", "松本", "井上", "木村", "林", "斎藤", "清水",
  "森", "池田", "橋本", "阿部", "石川", "前田", "藤田", "後藤", "近藤", "岡田",
];
const GIVEN_NAMES = [
  "翔太", "大輔", "健太", "拓也", "直樹", "浩二", "陽介", "秀樹", "智也", "雄大",
  "美咲", "愛", "陽子", "真由美", "さくら", "花子",
  "由美", "彩", "京子", "麻衣", "健一", "洋子", "亮太", "千尋", "優子", "誠",
  "香織", "拓真", "美穂", "隆",
];

const PREFECTURE_POOL = [
  "大阪府", "大阪府", "大阪府", "京都府", "京都府", "兵庫県", "兵庫県",
  "奈良県", "和歌山県", "千葉県", "千葉県", "東京都", "東京都", "神奈川県",
  "滋賀県", "愛知県", "福岡県", "北海道", "広島県", "岡山県",
];

const GROUP_TYPES = [
  { value: "family", label: "家族" },
  { value: "couple", label: "カップル・夫婦" },
  { value: "friends", label: "友人グループ" },
  { value: "solo", label: "ソロ" },
  { value: "other", label: "その他" },
];

const PURPOSES = [
  "記念日・特別なお祝い",
  "日常からのリフレッシュ",
  "子供の情操教育・自然体験",
  "引退馬支援活動への共感",
  "友人・家族との時間づくり",
  "その他",
];

const DESIRED_EXPERIENCES = [
  "ポニーとのふれあい",
  "餌やり体験",
  "ポニーのお手入れ体験",
  "馬の写真撮影",
  "バーベキュー",
  "星空を眺めながらのんびり過ごす時間",
  "乗馬体験（将来的に期待）",
  "自然散策・里山体験",
];

const STAY_STYLES = [
  "のんびり派（ゆっくり過ごしたい）",
  "アクティブ派（体験を満喫したい）",
  "子供中心のファミリー滞在",
  "記念日・特別な時間を重視",
];

const REFERRAL_SOURCES = [
  "Instagram",
  "X（Twitter）",
  "Google検索",
  "知人の紹介",
  "Retouchの引退馬支援活動を知って",
  "その他",
];

const REPEAT_INTENTIONS = ["ぜひまた来たい", "機会があれば", "わからない"];

const MEMORABLE_EXPERIENCES = [
  "ポニーに餌をあげた瞬間、子供が満面の笑みになったのが一番の思い出です。",
  "朝、テントから顔を出すとすぐそこにポニーがいて、非日常を感じました。",
  "スタッフの方が丁寧に馬との接し方を教えてくださり、初めてでも安心できました。",
  "バーベキューをしながら牧場を眺める時間が、何よりのリフレッシュになりました。",
  "ブラッシング体験で馬と距離が縮まる感覚がとても新鮮でした。",
  "夜、静かな牧場で過ごす時間がとても贅沢でした。",
  "馬の写真をたくさん撮ってもらえて、家族の記念になりました。",
  "子供が動物に触れるのを怖がらずに楽しめていたのが嬉しかったです。",
  "都会の喧騒を忘れて、ゆっくり過ごせました。",
  "引退馬の話をスタッフから聞けて、支援の意味を実感できました。",
  "友人グループでのんびり過ごせる貴重な時間でした。",
  "予想以上に馬との距離が近く、癒されました。",
];

const IMPROVEMENT_POINTS = [
  "",
  "シャワーの時間帯がもう少し柔軟だと嬉しいです。",
  "駐車場の案内がもう少し分かりやすいとよかったです。",
  "夜、少し虫が気になりました。",
  "受付の待ち時間が少し長く感じました。",
  "特にありません。とても満足しています。",
  "Wi-Fiがもう少し広い範囲で使えると助かります。",
  "案内看板がもう少しあると安心です。",
];

const LARGE_FACILITY_WISHES = [
  "乗馬体験ができるようになったら、ぜひまた来たいです。",
  "もっと広い牧場で、色々な馬と触れ合ってみたいです。",
  "寺ヶ池公園と連携したイベントがあれば参加したいです。",
  "夜のイベント（星空観察会など）があれば嬉しいです。",
  "季節ごとのイベントを企画してほしいです。",
  "子供向けの体験プログラムが増えるといいなと思います。",
  "",
  "友人にもすすめたいので、サイト数が増えるとありがたいです。",
];

const REVIEW_TEXTS = [
  "ポニーとの距離がとても近く、子供が大喜びでした。また家族で来たいです。",
  "牧場を眺めながらのBBQは最高の時間でした。スタッフの方も親切でした。",
  "馬に触れたのは初めてでしたが、優しく教えていただき安心して楽しめました。",
  "静かで特別な時間を過ごせました。都会の疲れが癒されました。",
  "引退馬支援の取り組みを知り、宿泊するだけで応援できるのが嬉しいです。",
  "朝、窓の外にポニーがいる景色は忘れられません。",
  "友人との旅行にぴったりの、のんびりできる場所でした。",
  "子供の情操教育にとても良い体験になりました。また利用したいです。",
  "1日4組限定だからこその、静かで贅沢な滞在でした。",
  "写真撮影がとても丁寧で、良い記念になりました。",
];

// Mirrors src/lib/survey-analysis.ts exactly, so seeded ai_tags/ai_summary
// match what the real app would have derived from the same free text.
const TAG_KEYWORDS = {
  ポニー: ["ポニー", "馬", "うま"],
  BBQ: ["bbq", "バーベキュー", "焼肉"],
  スタッフ対応: ["スタッフ", "対応", "接客"],
  景色自然: ["景色", "自然", "緑", "静か"],
  価格料金: ["価格", "料金", "値段", "高い", "安い"],
  設備清潔さ: ["トイレ", "シャワー", "設備", "清潔"],
  子供向け: ["子供", "子ども", "こども"],
  引退馬支援: ["引退馬", "支援", "retouch"],
};
function deriveTags(...texts) {
  const joined = texts.filter(Boolean).join(" ").toLowerCase();
  const tags = [];
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((kw) => joined.includes(kw.toLowerCase()))) tags.push(tag);
  }
  return tags;
}
function summarize(...texts) {
  const joined = texts.filter(Boolean).join(" / ").trim();
  if (!joined) return "";
  return joined.length > 140 ? `${joined.slice(0, 140)}…` : joined;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickWeighted(pairs) {
  // pairs: [[value, weight], ...]
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [value, weight] of pairs) {
    if ((r -= weight) <= 0) return value;
  }
  return pairs[pairs.length - 1][0];
}
function pickSubset(arr, minCount, maxCount) {
  const count = minCount + Math.floor(Math.random() * (maxCount - minCount + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}
function toISODate(date) {
  return date.toISOString().slice(0, 10);
}
function uniqueName(used) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const name = `${pick(SURNAMES)} ${pick(GIVEN_NAMES)}`;
    if (!used.has(name)) {
      used.add(name);
      return name;
    }
  }
  return `${pick(SURNAMES)} ${pick(GIVEN_NAMES)}${used.size}`;
}

function computeOptionQuantity(option, numAdults, numChildren) {
  return option.unit === "per_person" ? Math.max(1, numAdults + numChildren) : 1;
}

async function main() {
  const { count: existingDemoCount, error: countError } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .like("customer_email", "%@example.com");
  if (countError) throw countError;
  if ((existingDemoCount ?? 0) >= TOTAL_BOOKINGS) {
    console.log(`${existingDemoCount} demo bookings already exist (@example.com) — skipping seed.`);
    return;
  }

  const [{ data: siteTypes, error: siteErr }, { data: options, error: optErr }, { data: profiles }] =
    await Promise.all([
      supabase.from("site_types").select("*").eq("active", true),
      supabase.from("experience_options").select("*").eq("active", true),
      supabase.from("profiles").select("id, role").eq("role", "admin").limit(1),
    ]);
  if (siteErr) throw siteErr;
  if (optErr) throw optErr;
  if (!siteTypes?.length) throw new Error("No active site_types found — has 0001_init.sql been run?");
  if (!options?.length) throw new Error("No active experience_options found — has 0001_init.sql been run?");
  const adminProfileId = profiles?.[0]?.id ?? null;

  console.log(
    `Seeding with ${siteTypes.length} site type(s) and ${options.length} experience option(s).`,
  );

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const windowDays = Math.round((WINDOW_END.getTime() - WINDOW_START.getTime()) / DAY_MS) + 1;

  // Per-day active-group counter so seeded dates respect the 1日4組限定 cap.
  const activeCounts = new Map();
  function canPlace(stayDateISO, nights) {
    for (let i = 0; i < nights; i++) {
      const d = toISODate(addDays(new Date(`${stayDateISO}T00:00:00Z`), i));
      if ((activeCounts.get(d) || 0) >= MAX_GROUPS_PER_DAY) return false;
    }
    return true;
  }
  function place(stayDateISO, nights) {
    for (let i = 0; i < nights; i++) {
      const d = toISODate(addDays(new Date(`${stayDateISO}T00:00:00Z`), i));
      activeCounts.set(d, (activeCounts.get(d) || 0) + 1);
    }
  }
  // Picks a stay_date within [WINDOW_START, WINDOW_END] such that the whole
  // stay (stay_date .. stay_date+nights-1) fits inside the window.
  function pickActiveDate(nights) {
    const maxOffset = windowDays - nights;
    for (let attempt = 0; attempt < 300; attempt++) {
      const offset = Math.floor(Math.random() * (maxOffset + 1));
      const d = toISODate(addDays(WINDOW_START, offset));
      if (canPlace(d, nights)) {
        place(d, nights);
        return d;
      }
    }
    for (let offset = 0; offset <= maxOffset; offset++) {
      const d = toISODate(addDays(WINDOW_START, offset));
      if (canPlace(d, nights)) {
        place(d, nights);
        return d;
      }
    }
    throw new Error("Ran out of capacity while placing seed bookings — widen the date window.");
  }
  function pickAnyDate(nights) {
    // Rejected/cancelled bookings never occupy a real capacity slot.
    const maxOffset = windowDays - nights;
    return toISODate(addDays(WINDOW_START, Math.floor(Math.random() * (maxOffset + 1))));
  }

  // All 50 stay dates fall within Jan–Jun 2026 (see WINDOW_START/END above),
  // which is entirely in the past relative to "today" — so every booking has
  // already been decided one way or another; none are left "pending".
  const statusPlan = [
    ...Array(43).fill("approved"),
    ...Array(5).fill("rejected"),
    ...Array(2).fill("cancelled"),
  ].sort(() => Math.random() - 0.5);

  const usedNames = new Set();
  const bookingRows = [];
  const optionRowsByIndex = [];

  for (let i = 0; i < TOTAL_BOOKINGS; i++) {
    const status = statusPlan[i];
    const nights = pickWeighted([[1, 50], [2, 35], [3, 15]]);

    const stayDate = status === "approved" ? pickActiveDate(nights) : pickAnyDate(nights);

    const customerName = uniqueName(usedNames);
    const customerEmail = `guest${String(i + 1).padStart(3, "0")}@example.com`;
    const siteType = pick(siteTypes);
    const numAdults = pickWeighted([[1, 20], [2, 45], [3, 20], [4, 15]]);
    const numChildren = pickWeighted([[0, 55], [1, 30], [2, 15]]);
    const numInfants = pickWeighted([[0, 85], [1, 15]]);
    const groupType = pick(GROUP_TYPES).value;

    const selectedOptions = pickSubset(
      options.filter((o) => Math.random() < (o.price === 0 ? 0.6 : 0.4)),
      0,
      Math.min(3, options.length),
    );
    const optionsTotal = selectedOptions.reduce(
      (sum, opt) => sum + opt.price * computeOptionQuantity(opt, numAdults, numChildren),
      0,
    );
    const totalPrice = siteType.price_per_night * nights + optionsTotal;

    // Lead time: booked some days before the stay, never after "today".
    const leadDays = 3 + Math.floor(Math.random() * 35);
    const stayDateObj = new Date(`${stayDate}T00:00:00Z`);
    let createdAt = addDays(stayDateObj, -leadDays);
    if (createdAt > today) createdAt = addDays(today, -Math.floor(Math.random() * 10) - 1);

    const row = {
      status,
      stay_date: stayDate,
      nights,
      site_type_id: siteType.id,
      num_adults: numAdults,
      num_children: numChildren,
      num_infants: numInfants,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: `090-${String(1000 + Math.floor(Math.random() * 8999)).padStart(4, "0")}-${String(1000 + Math.floor(Math.random() * 8999)).padStart(4, "0")}`,
      region: pick(PREFECTURE_POOL),
      group_type: groupType,
      purpose: pick(PURPOSES),
      desired_experience: pickSubset(DESIRED_EXPERIENCES, 1, 3),
      stay_style: pick(STAY_STYLES),
      referral_source: pick(REFERRAL_SOURCES),
      repeat_intention: pick(REPEAT_INTENTIONS),
      notes: Math.random() < 0.3 ? "記念日のお祝いとして利用します。" : null,
      total_price: totalPrice,
      created_at: createdAt.toISOString(),
    };

    if (status === "approved") {
      row.approved_at = addDays(createdAt, 1 + Math.floor(Math.random() * 2)).toISOString();
      row.approved_by = adminProfileId;
    } else if (status === "cancelled") {
      row.cancelled_at = addDays(createdAt, 1 + Math.floor(Math.random() * 3)).toISOString();
    }

    bookingRows.push(row);
    optionRowsByIndex.push(
      selectedOptions.map((opt) => ({
        option_id: opt.id,
        quantity: computeOptionQuantity(opt, numAdults, numChildren),
        unit_price: opt.price,
      })),
    );
  }

  const { data: insertedBookings, error: insertBookingsError } = await supabase
    .from("bookings")
    .insert(bookingRows)
    .select("id, status, stay_date, nights, customer_name, customer_email");
  if (insertBookingsError) throw insertBookingsError;
  console.log(`Inserted ${insertedBookings.length} bookings.`);

  // Join by customer_email (unique per seeded row) rather than trusting
  // RETURNING order to match the VALUES order.
  const optionRowsByEmail = new Map(
    bookingRows.map((row, i) => [row.customer_email, optionRowsByIndex[i]]),
  );
  const bookingOptionRows = insertedBookings.flatMap((b) =>
    (optionRowsByEmail.get(b.customer_email) ?? []).map((opt) => ({ booking_id: b.id, ...opt })),
  );
  if (bookingOptionRows.length > 0) {
    const { error: insertOptionsError } = await supabase.from("booking_options").insert(bookingOptionRows);
    if (insertOptionsError) throw insertOptionsError;
    console.log(`Inserted ${bookingOptionRows.length} booking_options rows.`);
  }

  // -------------------------------------------------------------------------
  // Case studies: surveys (アンケート結果) + reviews (口コミ管理).
  //
  // Every approved booking gets a survey row (mirrors ensureSurveyForBooking
  // firing at approval time). Past-approved (checked out) ones additionally
  // get sent_at; ~75% of those also get a full response (responded_at + all
  // answers) — the rest simulate invitations that went unanswered.
  // -------------------------------------------------------------------------
  const approvedBookings = insertedBookings.filter((b) => b.status === "approved");
  const surveyRows = [];
  for (const b of approvedBookings) {
    // PostgREST's bulk insert normalizes missing keys to NULL across the
    // whole batch (rather than letting each row fall back to its column
    // default), so every survey row must explicitly list every column —
    // ai_tags especially, since it's NOT NULL with no per-row omission
    // allowed once any other row in the batch supplies it.
    const blankSurvey = {
      booking_id: b.id,
      sent_at: null,
      responded_at: null,
      satisfaction_score: null,
      memorable_experience: null,
      improvement_points: null,
      revisit_intention: null,
      review_ok: null,
      review_text: null,
      large_facility_wishes: null,
      ai_summary: null,
      ai_tags: [],
    };

    const checkout = addDays(new Date(`${b.stay_date}T00:00:00Z`), b.nights);
    const isPastCheckout = checkout <= today;
    if (!isPastCheckout) {
      surveyRows.push(blankSurvey);
      continue;
    }

    const sentAt = addDays(checkout, 1 + Math.floor(Math.random() * 3));
    const willRespond = Math.random() < 0.75;
    if (!willRespond) {
      surveyRows.push({ ...blankSurvey, sent_at: sentAt.toISOString() });
      continue;
    }

    const satisfactionScore = pickWeighted([[5, 40], [4, 40], [3, 15], [2, 5]]);
    const memorable = pick(MEMORABLE_EXPERIENCES);
    const improvement = pick(IMPROVEMENT_POINTS);
    const wishes = pick(LARGE_FACILITY_WISHES);
    const revisit =
      satisfactionScore >= 4
        ? pickWeighted([["ぜひまた行きたい", 70], ["機会があれば行きたい", 25], ["わからない", 5]])
        : pickWeighted([["機会があれば行きたい", 50], ["わからない", 35], ["難しい", 15]]);
    const reviewOk = satisfactionScore >= 4 && Math.random() < 0.7;
    const reviewText = reviewOk ? pick(REVIEW_TEXTS) : null;
    const respondedAt = addDays(sentAt, 1 + Math.floor(Math.random() * 12));

    surveyRows.push({
      booking_id: b.id,
      sent_at: sentAt.toISOString(),
      responded_at: respondedAt.toISOString(),
      satisfaction_score: satisfactionScore,
      memorable_experience: memorable,
      improvement_points: improvement || null,
      revisit_intention: revisit,
      review_ok: reviewOk,
      review_text: reviewText,
      large_facility_wishes: wishes || null,
      ai_summary: summarize(memorable, improvement, wishes),
      ai_tags: deriveTags(memorable, improvement, wishes),
    });
  }

  const { data: insertedSurveys, error: insertSurveysError } = await supabase
    .from("surveys")
    .insert(surveyRows)
    .select("id, booking_id, review_ok, review_text, satisfaction_score, responded_at");
  if (insertSurveysError) throw insertSurveysError;
  console.log(`Inserted ${insertedSurveys.length} survey rows.`);

  const nameByBookingId = new Map(insertedBookings.map((b) => [b.id, b.customer_name]));
  const reviewCandidates = insertedSurveys.filter((s) => s.review_ok && s.review_text);
  const reviewRows = reviewCandidates.map((s, i) => ({
    survey_id: s.id,
    booking_id: s.booking_id,
    display_name: nameByBookingId.get(s.booking_id) ?? "ゲスト",
    content: s.review_text,
    rating: s.satisfaction_score,
    published: i < Math.ceil(reviewCandidates.length * 0.7), // ~70% published, rest awaiting moderation
    created_at: s.responded_at,
  }));

  if (reviewRows.length > 0) {
    const { data: insertedReviews, error: insertReviewsError } = await supabase
      .from("reviews")
      .insert(reviewRows)
      .select("id, published");
    if (insertReviewsError) throw insertReviewsError;
    const publishedCount = insertedReviews.filter((r) => r.published).length;
    console.log(
      `Inserted ${insertedReviews.length} review rows (${publishedCount} published, ${insertedReviews.length - publishedCount} awaiting moderation).`,
    );
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
