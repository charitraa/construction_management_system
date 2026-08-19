import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ActionLink, Reveal, Section, SectionHeading } from "./primitives";
import { APP_NAV, AppFrame, ModuleId } from "./previews/AppFrame";
import { ScreenSwitch } from "./previews/screens";

/** One line per module, describing only what the module actually does. */
const COPY: Record<ModuleId, string> = {
  dashboard:
    "Revenue, expenses, profit and labour versus material cost, with monthly trends and an expense breakdown.",
  employees:
    "The workforce register — name, role, daily rate and contact details, with totals by role.",
  attendance:
    "Mark full day, half day or absent per employee per date. Summarise any date range.",
  advance:
    "Record cash advances taken by employees so they can be deducted at payment time.",
  payroll:
    "Days worked since the last payment × daily rate, minus advances, equals net pay.",
  projects:
    "Client, site, budget, start date and status for every project, with a detail view per project.",
  expenses:
    "Site spending by category — labour, materials, equipment, advances — tagged to a project.",
  revenue:
    "Client payments as they come in, with payment method and the project they belong to.",
  receivables:
    "Budget against received per project, so the outstanding balance is never in question.",
};

export function ModuleExplorer() {
  const [active, setActive] = useState<ModuleId>("projects");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const last = APP_NAV.length - 1;
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    setActive(APP_NAV[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section id="modules" tone="dark" className="relative overflow-hidden">
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

      <div className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="The modules"
            title="One platform. Every moving part."
            lead="Nine modules, one login, one set of records. Pick one to see the screen your team would actually work in."
            tone="light"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[264px_1fr] lg:gap-8">
          {/* Module list — roving tabindex, arrow-key navigable. */}
          <div
            role="tablist"
            aria-label="Product modules"
            aria-orientation="vertical"
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {APP_NAV.map((m, i) => {
              const Icon = m.icon;
              const isActive = m.id === active;
              return (
                <button
                  key={m.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  role="tab"
                  id={`module-tab-${m.id}`}
                  aria-selected={isActive}
                  aria-controls="module-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(m.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-[13.5px] font-semibold transition-all duration-200 ease-out lg:w-full",
                    isActive
                      ? "border-amber-500/40 bg-amber-500/12 text-white"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200",
                  )}
                >
                  <Icon
                    className={cn("h-4 w-4 shrink-0", isActive ? "text-amber-400" : "")}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{m.title}</span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="module-panel"
            aria-labelledby={`module-tab-${active}`}
            tabIndex={0}
            className="min-w-0"
          >
            <p className="mb-4 max-w-2xl text-[13.5px] leading-relaxed text-slate-300">
              {COPY[active]}
            </p>
            <AppFrame active={active} browser className="ring-1 ring-white/10">
              <ScreenSwitch active={active} />
            </AppFrame>
          </div>
        </div>

        <Reveal>
          <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-6 sm:flex-row sm:justify-between">
            <div>
              <p className="text-[15px] font-bold text-white">See the system in action.</p>
              <p className="mt-1 text-[13.5px] text-slate-400">
                Sign in to your workspace and start with your first project.
              </p>
            </div>
            <ActionLink to="/login" size="md" className="w-full sm:w-auto">
              Open the system
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ActionLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
