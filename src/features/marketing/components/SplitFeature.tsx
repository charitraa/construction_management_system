import { ReactNode } from "react";
import { Check } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

/**
 * Narrative block: the argument on top in two columns, then the real product
 * screen at full width beneath it. The screens are dense application UIs, so
 * they get the whole measure rather than half of it.
 */
export function SplitFeature({
  id,
  eyebrow,
  title,
  lead,
  points,
  media,
  tone = "light",
  footnote,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  lead: string;
  points: { title: string; body: string }[];
  media: ReactNode;
  tone?: "light" | "muted";
  footnote?: string;
}) {
  return (
    <Section id={id} tone={tone}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
          {footnote && (
            <p className="mt-7 border-l-2 border-amber-400/60 pl-4 text-[12.5px] leading-relaxed text-slate-500">
              {footnote}
            </p>
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:pt-2">
            {points.map((p) => (
              <li key={p.title}>
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/15 text-amber-600">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <p className="mt-3 text-[14.5px] font-bold text-ink-900">{p.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal delay={0.12} y={26} className="mt-12">
        {media}
      </Reveal>
    </Section>
  );
}
