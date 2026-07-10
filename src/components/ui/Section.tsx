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
      ? "bg-mist text-forest-dark"
      : tone === "white"
        ? "bg-white text-charcoal"
        : "bg-cream text-charcoal";

  return (
    <section id={id} className={`relative ${toneClass} py-16 sm:py-24 ${className}`}>
      {tone === "forest" && (
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      )}
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
