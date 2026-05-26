export function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 text-center md:mb-8">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
