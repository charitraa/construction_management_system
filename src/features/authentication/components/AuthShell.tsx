import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { LogoMark } from "@/features/marketing/components/primitives";

/**
 * Abstract floor plan: rooms, a circulation core and dimension ticks.
 * Purely decorative, drawn at low opacity behind the brand panel.
 */
function FloorPlan({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const stroke = { stroke: "currentColor", fill: "none", strokeWidth: 1.5 };
  return (
    <svg
      viewBox="0 0 400 320"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <motion.g
        initial={reduce ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <motion.rect
          x="40"
          y="40"
          width="320"
          height="240"
          rx="2"
          {...stroke}
          initial={reduce ? undefined : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.path
          d="M40 150h150M190 40v240M190 200h170"
          {...stroke}
          initial={reduce ? undefined : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.9 }}
        />
        <rect x="230" y="70" width="90" height="60" rx="1" {...stroke} strokeDasharray="4 4" />
        <path d="M100 150v-40M100 110h50" {...stroke} />
        <path d="M275 200v80" {...stroke} strokeDasharray="4 4" />
        {/* door swing */}
        <path d="M190 235a35 35 0 0 0 35-35" {...stroke} />
        {/* dimension line */}
        <path d="M40 300h320M40 294v12M360 294v12" {...stroke} strokeWidth="1" />
      </motion.g>
      <circle cx="100" cy="225" r="26" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" />
    </svg>
  );
}

/**
 * Two-panel authentication layout shared by sign in and sign up, so both
 * screens read as the same product as the landing page.
 */
export function AuthShell({
  lines,
  blurb,
  children,
}: {
  lines: string[];
  blurb: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="marketing min-h-screen bg-slate-50 antialiased lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Brand panel */}
      <aside className="relative overflow-hidden bg-ink-900 px-6 py-8 sm:px-10 lg:flex lg:flex-col lg:justify-between lg:py-14">
        <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[110px]"
          aria-hidden="true"
        />
        <FloorPlan className="pointer-events-none absolute -bottom-10 -right-16 hidden h-[420px] w-[520px] text-slate-400/25 lg:block" />

        <div className="relative flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Construction Management System — home">
            <LogoMark />
            <span className="text-[15px] font-extrabold tracking-tight text-white">
              Construction MS
            </span>
          </Link>
        </div>

        <div className="relative mt-8 lg:mt-0">
          <p className="label-micro text-amber-400">Construction Management System</p>
          <div className="mt-5 hidden lg:block">
            {lines.map((line, i) => (
              <motion.p
                key={line}
                initial={reduce ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="display-tight text-[3.2rem] font-extrabold text-white"
              >
                {line}
              </motion.p>
            ))}
          </div>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-slate-400 lg:mt-7">
            {blurb}
          </p>
        </div>

        <p className="relative mt-6 hidden text-[12px] text-slate-500 lg:mt-0 lg:block">
          © {new Date().getFullYear()} Construction Management System
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-5 py-12 sm:px-8 lg:py-14">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px] rounded-2xl border border-slate-200 bg-white p-7 shadow-panel sm:p-9"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

/* ── Field ──────────────────────────────────────────────────── */

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  required,
  trailing,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  trailing?: ReactNode;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "block text-[12.5px] font-semibold transition-colors duration-200",
          focused ? "text-amber-600" : "text-slate-600",
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          "mt-1.5 flex items-center gap-2 rounded-lg border bg-white px-3.5 transition-all duration-200",
          focused
            ? "border-amber-400 ring-2 ring-amber-100"
            : "border-slate-300 hover:border-slate-400",
          disabled && "opacity-60",
        )}
      >
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="h-11 w-full bg-transparent text-[14.5px] text-ink-900 outline-none placeholder:text-slate-400"
        />
        {trailing}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}
