import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-mist">
      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div
        className={`mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 sm:px-8 ${
          compact ? "sm:py-20" : "sm:py-24"
        }`}
      >
        <p className="font-serif text-xs tracking-[0.2em] text-terracotta uppercase">{eyebrow}</p>
        <h1 className="max-w-2xl font-serif text-3xl leading-snug font-semibold text-forest-dark sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-sm leading-relaxed text-charcoal-soft sm:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
