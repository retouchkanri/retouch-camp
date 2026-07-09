// Lightweight keyword-based tagging so free-text survey answers are queryable
// without an external AI dependency. Swap deriveTags()/summarize() for a real
// LLM call (e.g. the Claude API) later without touching any caller.

const TAG_KEYWORDS: Record<string, string[]> = {
  ポニー: ["ポニー", "馬", "うま"],
  BBQ: ["bbq", "バーベキュー", "焼肉"],
  スタッフ対応: ["スタッフ", "対応", "接客"],
  景色自然: ["景色", "自然", "緑", "静か"],
  価格料金: ["価格", "料金", "値段", "高い", "安い"],
  設備清潔さ: ["トイレ", "シャワー", "設備", "清潔"],
  子供向け: ["子供", "子ども", "こども"],
  引退馬支援: ["引退馬", "支援", "retouch"],
};

export function deriveTags(...texts: (string | null | undefined)[]): string[] {
  const joined = texts.filter(Boolean).join(" ").toLowerCase();
  const tags: string[] = [];
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((kw) => joined.includes(kw.toLowerCase()))) tags.push(tag);
  }
  return tags;
}

export function summarize(...texts: (string | null | undefined)[]): string {
  const joined = texts.filter(Boolean).join(" / ").trim();
  if (!joined) return "";
  return joined.length > 140 ? `${joined.slice(0, 140)}…` : joined;
}
