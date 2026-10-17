import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional id for the h2, so sections can reference it via aria-labelledby. */
  id?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {/* Orange stays a fill here: eyebrow text is too small for #FF9900. */}
      <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-ink-muted uppercase">
        <span aria-hidden className="h-1 w-6 rounded-full bg-aws-orange" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-pretty text-ink-muted">{description}</p>
      )}
    </div>
  );
}
