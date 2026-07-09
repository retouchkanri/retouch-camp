import { Container } from "./Container";

export function Section({
  children,
  className = "",
  tone = "cream",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "cream" | "white" | "forest";
  id?: string;
}) {
  const toneClass =
    tone === "forest"
      ? "bg-forest text-cream"
      : tone === "white"
        ? "bg-white text-charcoal"
        : "bg-cream text-charcoal";

  return (
    <section id={id} className={`${toneClass} py-16 sm:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-10 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-terracotta uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      {description && (
        <p className="mt-4 text-sm leading-relaxed text-charcoal-soft sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
