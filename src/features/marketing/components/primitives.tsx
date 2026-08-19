import { ReactNode, forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

/* ─────────────────────────── Logo ─────────────────────────── */

/**
 * Drafting-square mark: a right-angle set square with an offset inner rule.
 * Architectural rather than hard-hat — reads at 20px and at 64px.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
    >
      <rect width="32" height="32" rx="8" className="fill-ink-900" />
      <path
        d="M8 23.5V8.5h15"
        stroke="#F59E0B"
        strokeWidth="2.1"
        strokeLinecap="square"
      />
      <path
        d="M11.5 20V12h8"
        stroke="#FFFFFF"
        strokeOpacity=".55"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
      <path d="M8 23.5 23.5 8.5" stroke="#FFFFFF" strokeOpacity=".28" strokeWidth="1.4" />
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[15px] font-extrabold tracking-tight",
            tone === "dark" ? "text-ink-900" : "text-white",
          )}
        >
          Construction MS
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-medium tracking-[0.16em] uppercase",
            tone === "dark" ? "text-slate-400" : "text-slate-400",
          )}
        >
          Management System
        </span>
      </span>
    </span>
  );
}

/* ─────────────────────────── Buttons ─────────────────────────── */

type ButtonTone = "primary" | "dark" | "ghost" | "outline" | "light";

const toneStyles: Record<ButtonTone, string> = {
  primary:
    "bg-amber-500 text-ink-900 hover:bg-amber-400 shadow-[0_1px_2px_rgba(11,18,32,.12)] hover:shadow-[0_8px_20px_-8px_rgba(245,158,11,.7)]",
  dark: "bg-ink-900 text-white hover:bg-ink-800",
  outline:
    "border border-slate-300 bg-white text-ink-900 hover:border-slate-400 hover:bg-slate-50",
  light:
    "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30",
  ghost: "text-ink-700 hover:bg-slate-100",
};

const sizeStyles = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

interface ActionProps {
  tone?: ButtonTone;
  size?: keyof typeof sizeStyles;
  className?: string;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ease-out active:translate-y-px disabled:opacity-60 disabled:pointer-events-none";

/** Anchor-styled action that routes with react-router. */
export function ActionLink({
  to,
  tone = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ActionProps & { to: string } & React.ComponentProps<typeof Link>) {
  return (
    <Link
      to={to}
      className={cn(base, toneStyles[tone], sizeStyles[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** In-page anchor (scroll target). */
export function ActionAnchor({
  href,
  tone = "outline",
  size = "md",
  className,
  children,
}: ActionProps & { href: string }) {
  return (
    <a
      href={href}
      className={cn(base, toneStyles[tone], sizeStyles[size], className)}
    >
      {children}
    </a>
  );
}

export const ActionButton = forwardRef<
  HTMLButtonElement,
  ActionProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ tone = "primary", size = "md", className, children, ...rest }, ref) => (
  <button
    ref={ref}
    className={cn(base, toneStyles[tone], sizeStyles[size], className)}
    {...rest}
  >
    {children}
  </button>
));
ActionButton.displayName = "ActionButton";

/* ─────────────────────────── Text furniture ─────────────────────────── */

export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "label-micro inline-flex items-center gap-2",
        tone === "dark" ? "text-amber-600" : "text-amber-400",
        className,
      )}
    >
      <span className="h-px w-6 bg-current opacity-50" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "dark",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow tone={tone} className={align === "center" ? "justify-center" : ""}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "display-tight mt-4 text-[1.75rem] font-extrabold sm:text-[2.25rem] lg:text-[2.6rem]",
          tone === "dark" ? "text-ink-900" : "text-white",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-4 text-[15px] leading-relaxed sm:text-base",
            tone === "dark" ? "text-slate-600" : "text-slate-300",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────── Motion ─────────────────────────── */

/** Fades content up as it enters the viewport, once, honouring reduced motion. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── Data bits ─────────────────────────── */

const statusTone: Record<string, string> = {
  ongoing: "bg-sky-50 text-sky-700 border-sky-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  delayed: "bg-rose-50 text-rose-700 border-rose-200",
  "Full Day": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Half Day": "bg-amber-50 text-amber-700 border-amber-200",
  Absent: "bg-rose-50 text-rose-700 border-rose-200",
  Materials: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Labor: "bg-sky-50 text-sky-700 border-sky-200",
  Equipment: "bg-amber-50 text-amber-700 border-amber-200",
  Advance: "bg-violet-50 text-violet-700 border-violet-200",
  Other: "bg-slate-100 text-slate-600 border-slate-200",
};

export function StatusBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
        statusTone[value] ?? statusTone.Other,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {value}
    </span>
  );
}

/** Progress bar that draws itself when scrolled into view. */
export function ProgressBar({
  value,
  className,
  barClassName,
  delay = 0,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full rounded-full bg-amber-500", barClassName)}
        initial={reduce ? { width: `${value}%` } : { width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ─────────────────────────── Layout ─────────────────────────── */

/** Consistent page rhythm: 1200px measure, generous vertical band. */
export function Section({
  id,
  tone = "light",
  className,
  innerClassName,
  children,
}: {
  id?: string;
  tone?: "light" | "muted" | "dark";
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === "dark"
      ? "bg-ink-900 text-white"
      : tone === "muted"
        ? "bg-slate-50"
        : "bg-white";
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20 lg:py-24",
        toneClass,
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-[1200px]", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
