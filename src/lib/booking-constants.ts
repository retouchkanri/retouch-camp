// Client-safe constants for the booking form (no server-only imports here).

export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県", "海外",
] as const;

export const GROUP_TYPES = [
  { value: "family", label: "家族" },
  { value: "couple", label: "カップル・夫婦" },
  { value: "friends", label: "友人グループ" },
  { value: "solo", label: "ソロ" },
  { value: "other", label: "その他" },
] as const;

export const PURPOSES = [
  "記念日・特別なお祝い",
  "日常からのリフレッシュ",
  "子供の情操教育・自然体験",
  "引退馬支援活動への共感",
  "友人・家族との時間づくり",
  "その他",
] as const;

export const DESIRED_EXPERIENCES = [
  "ポニーとのふれあい",
  "餌やり体験",
  "記念写真撮影",
  "BBQ",
  "乗馬体験（将来的に期待）",
  "自然散策・里山体験",
] as const;

export const STAY_STYLES = [
  "のんびり派（ゆっくり過ごしたい）",
  "アクティブ派（体験を満喫したい）",
  "子供中心のファミリー滞在",
  "記念日・特別な時間を重視",
] as const;

export const REFERRAL_SOURCES = [
  "Instagram",
  "X（Twitter）",
  "Google検索",
  "知人の紹介",
  "Retouchの引退馬支援活動を知って",
  "その他",
] as const;

export const REPEAT_INTENTIONS = [
  { value: "ぜひまた来たい", label: "ぜひまた来たい" },
  { value: "機会があれば", label: "機会があれば" },
  { value: "わからない", label: "わからない" },
] as const;
