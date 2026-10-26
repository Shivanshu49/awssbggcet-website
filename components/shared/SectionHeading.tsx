import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional id for the h2, so sections can reference it via aria-labelledby. */
  id?: string;
  className?: string;
  /** Page sections use centered headings to match About and Events. */
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="font-mono text-xs tracking-widest text-amber-300 uppercase">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-1 text-2xl font-bold tracking-tight text-balance text-white sm:text-3xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-xs leading-relaxed text-pretty text-[#A89DB5] sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
}
