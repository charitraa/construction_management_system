import { Link } from "react-router-dom";
import { LogoMark } from "./primitives";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Modules", href: "#modules" },
      { label: "Workflow", href: "#workflow" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    heading: "Modules",
    links: [
      { label: "Projects", href: "#projects" },
      { label: "Workforce & payroll", href: "#workforce" },
      { label: "Cost control", href: "#finance" },
      { label: "Reporting", href: "#reporting" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-5 py-14 sm:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <span className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[15px] font-extrabold tracking-tight text-ink-900">
                Construction Management System
              </span>
            </span>
            <p className="mt-4 text-[13.5px] leading-relaxed text-slate-500">
              Projects, workforce, attendance, payroll, expenses, revenue and receivables
              — managed from one place, by the people who do the work.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="label-micro text-slate-400">{col.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[13.5px] text-slate-600 transition-colors hover:text-ink-900"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Account">
            <p className="label-micro text-slate-400">Account</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/login"
                  className="text-[13.5px] font-semibold text-slate-600 transition-colors hover:text-ink-900"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-[13.5px] text-slate-600 transition-colors hover:text-ink-900"
                >
                  Create an account
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] text-slate-400">
            © {new Date().getFullYear()} Construction Management System
          </p>
          <p className="text-[12.5px] text-slate-400">
            Figures shown throughout this page are sample data.
          </p>
        </div>
      </div>
    </footer>
  );
}
