import { useState } from "react";
import { HardHat, ClipboardList, LineChart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Reveal, Section, SectionHeading } from "./primitives";

/**
 * Framed as workflows, not permissions: the application does not currently
 * restrict modules per account, so nothing here implies that it does.
 */
const WORKFLOWS = [
  {
    id: "site",
    label: "On site",
    icon: HardHat,
    intro: "The supervisor's day is short and repetitive — and it all happens before 9am.",
    uses: [
      { module: "Attendance", detail: "Mark the crew present, half day or absent for today's date." },
      { module: "Advance", detail: "Log any cash handed to a worker so it is not forgotten at payday." },
      { module: "Expenses", detail: "Enter material deliveries and equipment hire against the right project." },
      { module: "Projects", detail: "Check the status and start date of the site you are standing on." },
    ],
  },
  {
    id: "office",
    label: "In the office",
    icon: ClipboardList,
    intro: "Administration is where the records become payments, invoices and files.",
    uses: [
      { module: "Employees", detail: "Keep the register current — new hires, daily rate changes, contact details." },
      { module: "Payroll", detail: "Run the cycle, check the day-by-day breakdown, mark employees as paid." },
      { module: "Revenue", detail: "Record client payments with the method and the project they settle." },
      { module: "Receivables", detail: "Filter to outstanding only and work the list of clients who owe." },
    ],
  },
  {
    id: "management",
    label: "Management",
    icon: LineChart,
    intro: "Owners want three numbers and the reason behind them.",
    uses: [
      { module: "Dashboard", detail: "Revenue, expenses and profit with the trend against the previous period." },
      { module: "Expenses", detail: "Category breakdown — is the overrun in materials, labour or equipment?" },
      { module: "Projects", detail: "How many projects are ongoing, completed, delayed — and against what budgets." },
      { module: "Receivables", detail: "Total outstanding across every client, in one figure." },
    ],
  },
];

export function WorkflowTabs() {
  const [active, setActive] = useState(WORKFLOWS[0].id);
  const reduce = useReducedMotion();
  const current = WORKFLOWS.find((w) => w.id === active)!;

  return (
    <Section id="workflow" tone="muted">
      <Reveal>
        <SectionHeading
          eyebrow="Ways of working"
          title="Built around how construction teams actually work."
          lead="The same records, approached from three directions. Nobody has to learn the whole system to use their part of it."
          align="center"
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div
          role="tablist"
          aria-label="Ways of working"
          className="mx-auto mt-10 flex w-full max-w-lg gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-panel"
        >
          {WORKFLOWS.map((w) => {
            const Icon = w.icon;
            const isActive = w.id === active;
            return (
              <button
                key={w.id}
                role="tab"
                id={`wf-tab-${w.id}`}
                aria-selected={isActive}
                aria-controls="wf-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(w.id)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors duration-200",
                  isActive ? "text-white" : "text-slate-500 hover:text-slate-700",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="wf-pill"
                    className="absolute inset-0 rounded-lg bg-ink-900"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 34 }
                    }
                  />
                )}
                <Icon className="relative h-4 w-4" aria-hidden="true" />
                <span className="relative whitespace-nowrap">{w.label}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div
        role="tabpanel"
        id="wf-panel"
        aria-labelledby={`wf-tab-${active}`}
        tabIndex={0}
        className="mx-auto mt-10 max-w-4xl"
      >
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-center text-[15px] font-medium text-slate-600">
            {current.intro}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {current.uses.map((u) => (
              <div
                key={u.module}
                className="rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-slate-300 hover:shadow-panel"
              >
                <p className="label-micro text-amber-600">{u.module}</p>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600">
                  {u.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-[12.5px] leading-relaxed text-slate-400">
        Every account currently has access to all modules. Per-role permissions are
        planned, not yet available.
      </p>
    </Section>
  );
}
