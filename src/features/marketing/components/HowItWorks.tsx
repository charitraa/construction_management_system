import { Reveal, Section, SectionHeading } from "./primitives";

const STEPS = [
  {
    n: "01",
    title: "Create your project",
    body: "Name it, attach the client and site location, set the start date and the contract budget.",
  },
  {
    n: "02",
    title: "Add your workforce",
    body: "Register masons and labourers with their daily rates, then mark attendance each day on site.",
  },
  {
    n: "03",
    title: "Record money as it moves",
    body: "Book expenses against the project, log client payments as they arrive, note any advances taken.",
  },
  {
    n: "04",
    title: "Run payroll and review",
    body: "Pay the crew on days actually worked, then read the dashboard for the state of the business.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" tone="light">
      <Reveal>
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, then it runs itself."
          lead="No implementation project, no migration plan. Open the system and start with the project you are running this week."
          align="center"
        />
      </Reveal>

      <ol className="relative mt-14 grid gap-8 lg:grid-cols-4 lg:gap-6">
        {/* Timeline rule: horizontal on desktop, vertical on mobile. */}
        <li
          aria-hidden="true"
          className="pointer-events-none absolute left-[19px] top-2 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-amber-400 via-slate-200 to-transparent sm:block lg:left-0 lg:top-[19px] lg:h-px lg:w-full lg:bg-gradient-to-r"
        />

        {STEPS.map((s, i) => (
          <li key={s.n} className="relative">
            <Reveal delay={i * 0.08} className="flex gap-5 lg:block">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[12px] font-extrabold text-ink-900 shadow-panel">
                {s.n}
              </span>
              <div className="lg:mt-5">
                <h3 className="text-[16px] font-bold tracking-tight text-ink-900">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-slate-600">
                  {s.body}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
