import type { ComponentType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import {
  DEMO_ATTENDANCE_STATS,
  DEMO_EMPLOYEES,
  DEMO_EMPLOYEE_STATS,
  DEMO_EXPENSES,
  DEMO_EXPENSE_BREAKDOWN,
  DEMO_MAIN_STATS,
  DEMO_PAYROLL,
  DEMO_PAYROLL_SUMMARY,
  DEMO_PROJECTS,
  DEMO_PROJECT_STATS,
  DEMO_RECEIVABLES_SUMMARY,
  DEMO_REVENUE,
  DEMO_TRENDS,
  formatRs,
  formatRsShort,
} from "../../data/demo";
import { ProgressBar, StatusBadge } from "../primitives";
import { AreaTrend, CategoryBars, ColumnStrip, Donut } from "./charts";
import { ModuleId, Panel, StatTile, TableHead, TableScroll } from "./AppFrame";

const row = "border-b border-slate-100 last:border-0";
const cell = "py-2 text-[11.5px] text-slate-600";
const cellR = `${cell} text-right num`;

/* ── Dashboard ──────────────────────────────────────────────── */

export function DashboardScreen() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatTile
          label="Revenue"
          value={formatRsShort(DEMO_MAIN_STATS.total_revenue)}
          trend={DEMO_MAIN_STATS.revenue_trend}
        />
        <StatTile
          label="Expenses"
          value={formatRsShort(DEMO_MAIN_STATS.total_expenses)}
          trend={DEMO_MAIN_STATS.expenses_trend}
        />
        <StatTile
          label="Profit"
          value={formatRsShort(DEMO_MAIN_STATS.profit)}
          trend={DEMO_MAIN_STATS.profit_trend}
          accent
        />
        <StatTile
          label="Labour cost"
          value={formatRsShort(DEMO_MAIN_STATS.labor_cost)}
          hint="this period"
        />
      </div>

      <div className="grid gap-2.5 lg:grid-cols-[1.55fr_1fr]">
        <Panel
          title="Revenue vs expenses"
          action={
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-full bg-amber-500" /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-3 rounded-full bg-slate-400" /> Expenses
              </span>
            </div>
          }
        >
          <AreaTrend data={DEMO_TRENDS} height={140} />
          <div className="mt-1 flex justify-between px-0.5">
            {DEMO_TRENDS.map((t) => (
              <span key={t.month} className="text-[9.5px] text-slate-400">
                {t.month}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Expense distribution">
          <div className="flex items-center gap-4">
            <Donut data={DEMO_EXPENSE_BREAKDOWN} size={104} thickness={14} />
            <ul className="min-w-0 flex-1 space-y-1.5">
              {DEMO_EXPENSE_BREAKDOWN.map((d) => (
                <li key={d.name} className="flex items-center gap-2 text-[10.5px]">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: d.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-slate-500">{d.name}</span>
                  <span className="num font-semibold text-ink-900">
                    {formatRsShort(d.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Active projects" value={String(DEMO_PROJECT_STATS.ongoing)} hint="ongoing" />
        <StatTile label="Employees" value={String(DEMO_EMPLOYEE_STATS.total)} hint="on the books" />
        <StatTile
          label="Attendance"
          value={`${DEMO_ATTENDANCE_STATS.percentage}%`}
          hint="present today"
        />
      </div>
    </div>
  );
}

/* ── Projects ───────────────────────────────────────────────── */

export function ProjectsScreen({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile label="Total" value={String(DEMO_PROJECT_STATS.total)} />
        <StatTile label="Ongoing" value={String(DEMO_PROJECT_STATS.ongoing)} accent />
        <StatTile label="Completed" value={String(DEMO_PROJECT_STATS.completed)} />
        <StatTile label="Delayed" value={String(DEMO_PROJECT_STATS.delayed)} />
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {DEMO_PROJECTS.slice(0, compact ? 2 : 4).map((p, i) => (
          <div
            key={p.name}
            className="rounded-lg border border-slate-200 bg-white p-3.5 transition-shadow duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-bold text-ink-900">{p.name}</p>
                <p className="mt-0.5 truncate text-[10.5px] text-slate-400">
                  {p.client_name} · {p.location}
                </p>
              </div>
              <StatusBadge value={p.status} />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <ProgressBar
                value={p.progress}
                delay={i * 0.08}
                barClassName={
                  p.status === "delayed"
                    ? "bg-rose-400"
                    : p.status === "completed"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                }
              />
              <span className="num w-8 shrink-0 text-right text-[11px] font-bold text-slate-600">
                {p.progress}%
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2.5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                  Budget
                </p>
                <p className="num mt-0.5 text-[11.5px] font-bold text-ink-900">
                  {formatRs(p.budget)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                  Received
                </p>
                <p className="num mt-0.5 text-[11.5px] font-bold text-emerald-600">
                  {formatRs(p.received)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Employees ──────────────────────────────────────────────── */

export function EmployeesScreen() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Total" value={String(DEMO_EMPLOYEE_STATS.total)} />
        <StatTile label="Mason" value={String(DEMO_EMPLOYEE_STATS.Mason)} accent />
        <StatTile label="Labor" value={String(DEMO_EMPLOYEE_STATS.Labor)} />
      </div>

      <Panel title="Employee register">
        <TableScroll min={420}>
          <table className="w-full">
            <TableHead cols={["Name", "Role", "Daily rate", "Phone"]} />
            <tbody>
              {DEMO_EMPLOYEES.map((e) => (
                <tr key={e.name} className={row}>
                  <td className={cell}>
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[9.5px] font-bold text-slate-500">
                        {e.name.charAt(0)}
                      </span>
                      <span className="font-semibold text-ink-900">{e.name}</span>
                    </span>
                  </td>
                  <td className={`${cell} text-right`}>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        e.role === "Mason"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-slate-200 bg-slate-50 text-slate-600",
                      )}
                    >
                      {e.role}
                    </span>
                  </td>
                  <td className={cellR}>{formatRs(e.daily_rate)}</td>
                  <td className={`${cellR} text-slate-400`}>{e.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      </Panel>
    </div>
  );
}

/* ── Attendance ─────────────────────────────────────────────── */

export function AttendanceScreen() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Present" value={String(DEMO_ATTENDANCE_STATS.present)} accent />
        <StatTile label="Absent" value={String(DEMO_ATTENDANCE_STATS.absent)} />
        <StatTile label="Rate" value={`${DEMO_ATTENDANCE_STATS.percentage}%`} />
      </div>

      <div className="grid gap-2.5 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Mark attendance"
          action={
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              २०८३ भदौ ३ · 2026-08-19
            </span>
          }
        >
          <ul className="space-y-1.5">
            {DEMO_EMPLOYEES.map((e) => (
              <li
                key={e.name}
                className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/60 px-2.5 py-1.5"
              >
                <span className="flex items-center gap-2 text-[11.5px] font-semibold text-ink-900">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-slate-500 ring-1 ring-slate-200">
                    {e.name.charAt(0)}
                  </span>
                  {e.name}
                </span>
                <StatusBadge value={e.attendance} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Last 14 days">
          <ColumnStrip values={[28, 30, 26, 31, 29, 24, 12, 30, 31, 28, 27, 31, 29, 28]} />
          <p className="mt-2.5 text-[10.5px] leading-relaxed text-slate-400">
            Daily present count across the workforce. Full day, half day and absent are
            recorded per employee and roll straight into payroll.
          </p>
        </Panel>
      </div>
    </div>
  );
}

/* ── Advance ────────────────────────────────────────────────── */

export function AdvanceScreen() {
  const advances = DEMO_PAYROLL.filter((p) => p.advance > 0);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile label="Total advance" value={formatRsShort(29000)} accent />
        <StatTile label="Records" value="12" />
        <StatTile label="Average" value={formatRsShort(2417)} />
        <StatTile label="Highest" value={formatRsShort(12000)} />
      </div>
      <Panel title="Advance ledger">
        <TableScroll min={420}>
          <table className="w-full">
            <TableHead cols={["Employee", "Role", "Date", "Amount"]} />
            <tbody>
              {advances.map((a, i) => (
                <tr key={a.name} className={row}>
                  <td className={`${cell} font-semibold text-ink-900`}>{a.name}</td>
                  <td className={`${cellR} text-slate-400`}>{a.role}</td>
                  <td className={`${cellR} text-slate-400`}>2026-08-{11 + i}</td>
                  <td className={`${cellR} font-bold text-ink-900`}>{formatRs(a.advance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      </Panel>
    </div>
  );
}

/* ── Payroll ────────────────────────────────────────────────── */

export function PayrollScreen() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Total wages" value={formatRsShort(DEMO_PAYROLL_SUMMARY.total_wages)} />
        <StatTile label="Advances" value={formatRsShort(DEMO_PAYROLL_SUMMARY.total_advances)} />
        <StatTile
          label="Net payable"
          value={formatRsShort(DEMO_PAYROLL_SUMMARY.total_net_pay)}
          accent
        />
      </div>

      <Panel
        title="Payroll — days worked since last payment"
        action={
          <span className="rounded-md bg-ink-900 px-2 py-1 text-[9.5px] font-bold text-white">
            Mark as paid
          </span>
        }
      >
        <TableScroll min={560}>
          <table className="w-full">
            <TableHead cols={["Employee", "Days", "Rate", "Wage", "Advance", "Net pay"]} />
            <tbody>
              {DEMO_PAYROLL.map((p) => (
                <tr key={p.name} className={row}>
                  <td className={cell}>
                    <span className="font-semibold text-ink-900">{p.name}</span>
                    <span className="ml-1.5 text-[10px] text-slate-400">{p.role}</span>
                  </td>
                  <td className={cellR}>{p.days}</td>
                  <td className={`${cellR} text-slate-400`}>{formatRs(p.daily_rate)}</td>
                  <td className={cellR}>{formatRs(p.wage)}</td>
                  <td className={`${cellR} text-rose-600`}>−{formatRs(p.advance)}</td>
                  <td className={`${cellR} font-bold text-ink-900`}>{formatRs(p.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      </Panel>
    </div>
  );
}

/* ── Expenses ───────────────────────────────────────────────── */

export function ExpensesScreen() {
  const total = DEMO_EXPENSE_BREAKDOWN.reduce((s, d) => s + d.value, 0);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile label="Total" value={formatRsShort(total)} accent />
        <StatTile label="Entries" value="148" />
        <StatTile label="Average" value={formatRsShort(8176)} />
        <StatTile label="Highest" value={formatRsShort(372000)} />
      </div>

      <div className="grid gap-2.5 lg:grid-cols-[1.5fr_1fr]">
        <Panel
          title="Recent expenses"
          action={
            <span className="rounded-md border border-slate-200 px-2 py-0.5 text-[9.5px] font-semibold text-slate-500">
              Export CSV
            </span>
          }
        >
          <TableScroll min={460}>
            <table className="w-full">
              <TableHead cols={["Description", "Category", "Project", "Amount"]} />
              <tbody>
                {DEMO_EXPENSES.map((e) => (
                  <tr key={e.description} className={row}>
                    <td className={cell}>
                      <span className="font-semibold text-ink-900">{e.description}</span>
                      <span className="ml-1.5 text-[10px] text-slate-400">{e.date}</span>
                    </td>
                    <td className={`${cell} text-right`}>
                      <StatusBadge value={e.category} />
                    </td>
                    <td className={`${cellR} max-w-[110px] truncate text-slate-400`}>
                      {e.project}
                    </td>
                    <td className={`${cellR} font-bold text-ink-900`}>{formatRs(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
        </Panel>

        <Panel title="By category">
          <CategoryBars data={DEMO_EXPENSE_BREAKDOWN} />
          <div className="mt-3 border-t border-slate-100 pt-2.5">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Period total
            </p>
            <p className="num mt-1 text-[17px] font-extrabold text-ink-900">
              {formatRs(total)}
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ── Revenue ────────────────────────────────────────────────── */

export function RevenueScreen() {
  const total = DEMO_REVENUE.reduce((s, r) => s + r.amount, 0);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2.5">
        <StatTile label="Revenue recorded" value={formatRsShort(total)} accent />
        <StatTile label="Payments" value={String(DEMO_REVENUE.length)} />
        <StatTile label="Clients" value="9" />
      </div>

      <Panel title="Payments received">
        <TableScroll min={520}>
          <table className="w-full">
            <TableHead cols={["Description", "Client", "Method", "Date", "Amount"]} />
            <tbody>
              {DEMO_REVENUE.map((r) => (
                <tr key={r.description} className={row}>
                  <td className={`${cell} font-semibold text-ink-900`}>{r.description}</td>
                  <td className={`${cellR} text-slate-500`}>{r.client_name}</td>
                  <td className={`${cell} text-right`}>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {r.pay_method}
                    </span>
                  </td>
                  <td className={`${cellR} text-slate-400`}>{r.date}</td>
                  <td className={`${cellR} font-bold text-emerald-600`}>
                    {formatRs(r.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      </Panel>
    </div>
  );
}

/* ── Receivables ────────────────────────────────────────────── */

export function ReceivablesScreen() {
  const s = DEMO_RECEIVABLES_SUMMARY;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile label="Contract value" value={formatRsShort(s.total_budget)} />
        <StatTile label="Received" value={formatRsShort(s.total_received)} />
        <StatTile label="Outstanding" value={formatRsShort(s.total_remaining)} accent />
        <StatTile label="Clients with dues" value={String(s.clients_with_dues)} />
      </div>

      <Panel
        title="Outstanding by project"
        action={
          <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9.5px] font-semibold text-amber-700">
            Outstanding only
          </span>
        }
      >
        <TableScroll min={560}>
          <table className="w-full">
            <TableHead cols={["Project", "Client", "Budget", "Received", "Remaining"]} />
            <tbody>
              {DEMO_PROJECTS.map((p) => (
                <tr key={p.name} className={row}>
                  <td className={`${cell} font-semibold text-ink-900`}>{p.name}</td>
                  <td className={`${cellR} text-slate-500`}>{p.client_name}</td>
                  <td className={cellR}>{formatRs(p.budget)}</td>
                  <td className={`${cellR} text-emerald-600`}>{formatRs(p.received)}</td>
                  <td
                    className={cn(
                      cellR,
                      "font-bold",
                      p.budget - p.received > 0 ? "text-rose-600" : "text-slate-300",
                    )}
                  >
                    {p.budget - p.received > 0 ? formatRs(p.budget - p.received) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableScroll>
      </Panel>
    </div>
  );
}

/* ── Registry ───────────────────────────────────────────────── */

export const SCREENS: Record<ModuleId, ComponentType> = {
  dashboard: DashboardScreen,
  employees: EmployeesScreen,
  attendance: AttendanceScreen,
  advance: AdvanceScreen,
  payroll: PayrollScreen,
  projects: ProjectsScreen,
  expenses: ExpensesScreen,
  revenue: RevenueScreen,
  receivables: ReceivablesScreen,
};

/** Crossfade wrapper used by the module explorer. */
export function ScreenSwitch({ active }: { active: ModuleId }) {
  const reduce = useReducedMotion();
  const Screen = SCREENS[active];
  return (
    <motion.div
      key={active}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Screen />
    </motion.div>
  );
}
