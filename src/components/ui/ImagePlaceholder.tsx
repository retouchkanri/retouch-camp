type ImagePlaceholderProps = {
  /** Short title shown on the placeholder, e.g. "ポニーとのふれあい" */
  label: string;
  /** What photo/illustration should go here and how it will be used */
  description: string;
  /** Optional note on style/source reference, e.g. "horserest.jp の放牧写真のような自然光の雰囲気" */
  sourceHint?: string;
  aspect?: "video" | "square" | "portrait" | "wide";
  className?: string;
};

const ASPECT_CLASS: Record<NonNullable<ImagePlaceholderProps["aspect"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/7]",
};

/**
 * Visually-obvious stand-in for a real photo. Renders the exact image brief so
 * whoever wires up final assets knows precisely what to shoot/upload and where.
 * Replace with a Next/Image once the real photo is available — same aspect ratio.
 */
export function ImagePlaceholder({
  label,
  description,
  sourceHint,
  aspect = "video",
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative flex ${ASPECT_CLASS[aspect]} w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-sage/50 bg-gradient-to-br from-sage-light/30 via-cream-dark to-sage/20 p-6 text-center ${className}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-8 w-8 text-forest/40"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5l5-5a2 2 0 0 1 2.8 0l3.7 3.7M13 12l1.8-1.8a2 2 0 0 1 2.8 0L21 13.5M3 6.5h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-13z"
        />
        <circle cx="8" cy="9.5" r="1.5" />
      </svg>
      <p className="font-serif text-sm font-medium text-forest-dark">画像: {label}</p>
      <p className="max-w-sm text-xs leading-relaxed text-charcoal-soft">{description}</p>
      {sourceHint && (
        <p className="max-w-sm text-[11px] leading-relaxed text-sage">参考: {sourceHint}</p>
      )}
    </div>
  );
}
