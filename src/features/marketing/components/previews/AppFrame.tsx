import { ReactNode } from "react";
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  User,
  Briefcase,
  ReceiptText,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { LogoMark } from "../primitives";

/** Mirrors src/shared/components/Layout.tsx navigationItems, in the same order. */
export const APP_NAV = [
  { id: "dashboard", title: "Dashboard", icon: BarChart3 },
  { id: "employees", title: "Employees", icon: Users },
  { id: "attendance", title: "Attendance", icon: Calendar },
  { id: "advance", title: "Advance", icon: DollarSign },
  { id: "payroll", title: "Payroll", icon: User },
  { id: "projects", title: "Projects", icon: Briefcase },
  { id: "expenses", title: "Expenses", icon: ReceiptText },
  { id: "revenue", title: "Revenue", icon: TrendingUp },
  { id: "receivables", title: "Receivables", icon: Wallet },
] as const;

export type ModuleId = (typeof APP_NAV)[number]["id"];

/**
 * Chrome for every product preview: optional browser bar, the app's own
 * sidebar and top bar, then the screen itself.
 */
export function AppFrame({
  active,
  children,
  browser = false,
  className,
  sidebar = true,
}: {
  active: ModuleId;
  children: ReactNode;
  browser?: boolean;
  className?: string;
  sidebar?: boolean;
}) {
  const current = APP_NAV.find((n) => n.id === active) ?? APP_NAV[0];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-float",
        className,
      )}
    >
      {browser && (
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-100/80 px-3.5 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          </div>
          <div className="mx-auto flex w-full max-w-sm items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-400">
            <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" aria-hidden="true">
              <path
                d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <span className="truncate">
              constructionmanagementsystem.netlify.app/{current.id === "dashboard" ? "" : current.id}
            </span>
          </div>
        </div>
      )}

      <div className="flex bg-slate-50">
        {sidebar && (
          <aside className="hidden w-[172px] shrink-0 flex-col border-r border-slate-200 bg-white sm:flex">
            <div className="flex h-12 items-center gap-2 border-b border-slate-200 px-3.5">
              <LogoMark className="h-6 w-6" />
              <div className="leading-none">
                <p className="text-[12px] font-bold text-ink-900">CMS</p>
                <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-slate-400">
                  Construction
                </p>
              </div>
            </div>
            <nav className="flex-1 space-y-0.5 p-2">
              {APP_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === active;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[11.5px] font-medium transition-colors duration-200",
                      isActive
                        ? "bg-ink-900 text-white"
                        : "text-slate-500",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{item.title}</span>
                  </div>
                );
              })}
            </nav>
          </aside>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4">
            <p className="text-[13px] font-semibold text-ink-900">{current.title}</p>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 sm:inline">
                Sample data
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-[10px] font-bold text-white">
                A
              </span>
            </div>
          </div>
          <div className="p-3.5 sm:p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared screen furniture ────────────────────────────────── */

export function StatTile({
  label,
  value,
  hint,
  trend,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: number;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        accent ? "border-amber-200 bg-amber-50/60" : "border-slate-200 bg-white",
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </p>
      <p className="num mt-1.5 text-[19px] font-extrabold text-ink-900">{value}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {typeof trend === "number" && (
          <span
            className={cn(
              "num rounded-full px-1.5 py-px text-[10px] font-bold",
              trend >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700",
            )}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
        )}
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </div>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-3.5",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11.5px] font-bold text-ink-900">{title}</p>
        {action}
      </div>
      {children}
    </div>
  );
}

export function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-slate-200">
        {cols.map((c, i) => (
          <th
            key={c}
            scope="col"
            className={cn(
              "pb-2 text-[9.5px] font-bold uppercase tracking-[0.1em] text-slate-400",
              i === 0 ? "text-left" : "text-right",
            )}
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

/**
 * Dense application tables do not compress below a certain width without
 * becoming unreadable, so they scroll sideways inside their panel instead of
 * pushing the page out.
 */
export function TableScroll({
  min,
  children,
}: {
  min: number;
  children: ReactNode;
}) {
  return (
    <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
      <div style={{ minWidth: min }}>{children}</div>
    </div>
  );
}
