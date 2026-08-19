import {
  Briefcase,
  Users,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Reveal, Section, SectionHeading } from "./primitives";

const VALUES = [
  {
    icon: Briefcase,
    title: "Project control",
    body: "Every project with its client, site location, start date, budget and status — ongoing, completed or delayed — in one register you can search, filter and export.",
  },
  {
    icon: Users,
    title: "Workforce & attendance",
    body: "Keep masons and labourers on the books with their daily rates, then record full day, half day or absent for each of them, every day.",
  },
  {
    icon: Wallet,
    title: "Cost control",
    body: "Log expenses against the project that incurred them, record client payments as they arrive, and see labour and material costs separated out.",
  },
  {
    icon: BarChart3,
    title: "Reporting",
    body: "Revenue against expenses month by month, expense distribution by category, attendance rates and payroll summaries — with CSV export from the main registers.",
  },
];

export function ValueSection() {
  return (
    <Section id="features" tone="muted">
      <Reveal>
        <SectionHeading
          eyebrow="Why teams use it"
          title="Everything your construction team needs to stay in control."
          lead="Four things decide whether a site runs well: where the work stands, who turned up, what it cost, and what the client still owes. The system covers all four."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v, i) => {
          const Icon = v.icon;
          return (
            <Reveal key={v.title} delay={i * 0.07}>
              <article className="group h-full rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-lift">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-900 text-amber-400 transition-colors duration-300 group-hover:bg-amber-500 group-hover:text-ink-900">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[17px] font-bold tracking-tight text-ink-900">
                  {v.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600">
                  {v.body}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
