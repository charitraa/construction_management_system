import { X, Check } from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const BEFORE = [
  "A spreadsheet per project, and a different one per person",
  "Attendance in a site notebook that has to be typed up later",
  "Advances remembered, not recorded — and argued about at payday",
  "Expense bills in a drawer until the accountant asks",
  "Nobody sure what a client has actually paid",
  "Reporting means an evening of copying numbers between files",
];

const AFTER = [
  "One register of projects, with client, budget and status",
  "Attendance marked on the day, feeding payroll directly",
  "Advances logged against the employee and deducted automatically",
  "Expenses categorised and tagged to the project on entry",
  "Received against budget, per project, always current",
  "The dashboard is already written by the time you open it",
];

export function BeforeAfter() {
  return (
    <Section tone="light">
      <Reveal>
        <SectionHeading
          eyebrow="The difference"
          title="From scattered records to one source of truth."
          align="center"
        />
      </Reveal>

      <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-5">
        <Reveal>
          <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
            <p className="label-micro text-slate-400">Before</p>
            <h3 className="mt-3 text-[19px] font-bold tracking-tight text-slate-500">
              Managed on paper and in spreadsheets
            </h3>
            <ul className="mt-6 space-y-3.5">
              {BEFORE.map((b) => (
                <li key={b} className="flex gap-3 text-[13.5px] leading-relaxed text-slate-500">
                  <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-slate-200 p-1 text-slate-500">
                    <X className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative h-full overflow-hidden rounded-xl border border-ink-800 bg-ink-900 p-6 sm:p-7">
            <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
            <div className="relative">
              <p className="label-micro text-amber-400">After</p>
              <h3 className="mt-3 text-[19px] font-bold tracking-tight text-white">
                Managed in the Construction Management System
              </h3>
              <ul className="mt-6 space-y-3.5">
                {AFTER.map((a) => (
                  <li key={a} className="flex gap-3 text-[13.5px] leading-relaxed text-slate-300">
                    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-amber-500 p-1 text-ink-900">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
