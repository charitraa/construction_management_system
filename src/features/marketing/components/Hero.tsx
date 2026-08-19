import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { ActionAnchor, ActionLink, Eyebrow } from "./primitives";
import { AppFrame } from "./previews/AppFrame";
import { DashboardScreen } from "./previews/screens";

const MODULES = [
  "Projects",
  "Employees",
  "Attendance",
  "Advance",
  "Payroll",
  "Expenses",
  "Revenue",
  "Receivables",
];

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative overflow-hidden bg-ink-900 pt-[72px]">
      {/* Drafting grid + a single warm light source, low opacity. */}
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-slate-50"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-5 pb-24 pt-16 sm:px-8 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...rise(0)}>
            <Eyebrow tone="light" className="justify-center">
              Construction operations software
            </Eyebrow>
          </motion.div>

          <motion.h1
            {...rise(0.08)}
            className="display-tight mt-6 text-[2.4rem] font-extrabold text-white sm:text-[3.4rem] lg:text-[4rem]"
          >
            Construction management,
            <br className="hidden sm:block" />{" "}
            <span className="text-amber-400">all in one place.</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-300 sm:text-[17px]"
          >
            Plan projects, manage your workforce, record daily attendance, run payroll,
            track expenses and revenue, and chase what clients still owe — from a single
            platform your whole team works out of.
          </motion.p>

          <motion.div
            {...rise(0.24)}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <ActionLink to="/login" size="lg" className="w-full sm:w-auto">
              Sign in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ActionLink>
            <ActionAnchor href="#features" tone="light" size="lg" className="w-full sm:w-auto">
              Explore features
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </ActionAnchor>
          </motion.div>

          <motion.ul
            {...rise(0.32)}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-2"
          >
            {MODULES.map((m) => (
              <li
                key={m}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11.5px] font-medium text-slate-300"
              >
                {m}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* The product itself is the hero image. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-[1080px] sm:mt-16"
        >
          <div
            className="pointer-events-none absolute -inset-x-6 -top-4 bottom-0 rounded-[24px] bg-white/5 blur-2xl"
            aria-hidden="true"
          />
          <AppFrame active="dashboard" browser className="relative ring-1 ring-black/5">
            <DashboardScreen />
          </AppFrame>
          <p className="mt-3 text-center text-[11.5px] text-slate-400">
            The dashboard as it appears in the product. Figures shown are sample data.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
