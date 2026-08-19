import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

/** Catmull-Rom → cubic bezier, so series read as a drawn curve not a polyline. */
function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export interface TrendPoint {
  month: string;
  revenue: number;
  expenses: number;
}

/** Revenue vs expenses area chart — mirrors the dashboard's monthly trend. */
export function AreaTrend({
  data,
  className,
  height = 150,
}: {
  data: TrendPoint[];
  className?: string;
  height?: number;
}) {
  const reduce = useReducedMotion();
  const w = 520;
  const h = height;
  const padY = 14;
  const max = Math.max(...data.map((d) => Math.max(d.revenue, d.expenses))) * 1.08;
  const x = (i: number) => (i / (data.length - 1)) * w;
  const y = (v: number) => h - padY - (v / max) * (h - padY * 2);

  const rev = data.map((d, i) => [x(i), y(d.revenue)] as [number, number]);
  const exp = data.map((d, i) => [x(i), y(d.expenses)] as [number, number]);
  const revPath = smoothPath(rev);
  const expPath = smoothPath(exp);
  const draw = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true },
      };

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("w-full", className)}
      preserveAspectRatio="none"
      role="img"
      aria-label="Revenue against expenses over the last six months"
    >
      <defs>
        <linearGradient id="cms-rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cms-exp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64748B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#64748B" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1="0"
          x2={w}
          y1={padY + t * (h - padY * 2)}
          y2={padY + t * (h - padY * 2)}
          stroke="#E2E8F0"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
      ))}

      <motion.path
        d={`${expPath} L ${w} ${h} L 0 ${h} Z`}
        fill="url(#cms-exp)"
        initial={reduce ? undefined : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.35 }}
      />
      <motion.path
        d={`${revPath} L ${w} ${h} L 0 ${h} Z`}
        fill="url(#cms-rev)"
        initial={reduce ? undefined : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />

      <motion.path
        d={expPath}
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
        {...draw}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <motion.path
        d={revPath}
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinecap="round"
        {...draw}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
      />

      <motion.circle
        cx={rev[rev.length - 1][0] - 3}
        cy={rev[rev.length - 1][1]}
        r="4"
        fill="#F59E0B"
        stroke="#fff"
        strokeWidth="2"
        initial={reduce ? undefined : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.15, type: "spring", stiffness: 300 }}
      />
    </svg>
  );
}

export interface Slice {
  name: string;
  value: number;
  color: string;
}

/** Expense distribution donut — mirrors the dashboard pie. */
export function Donut({
  data,
  size = 132,
  thickness = 16,
  className,
}: {
  data: Slice[];
  size?: number;
  thickness?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Expense distribution by category"
    >
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const dash = `${len - 2} ${c - len + 2}`;
          const el = (
            <motion.circle
              key={d.name}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              style={{ transformOrigin: "center" }}
            />
          );
          offset += len;
          return el;
        })}
      </g>
    </svg>
  );
}

/** Horizontal category bars — mirrors the expenses breakdown panel. */
export function CategoryBars({
  data,
  className,
}: {
  data: Slice[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className={cn("space-y-2.5", className)}>
      {data.map((d, i) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="w-[68px] shrink-0 text-[11px] font-medium text-slate-500">
            {d.name}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full"
              style={{ background: d.color }}
              initial={reduce ? { width: `${(d.value / max) * 100}%` } : { width: 0 }}
              whileInView={{ width: `${(d.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Compact vertical bars, used for attendance-by-day style strips. */
export function ColumnStrip({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const max = Math.max(...values);
  return (
    <div className={cn("flex h-16 items-end gap-1.5", className)}>
      {values.map((v, i) => (
        <motion.div
          key={i}
          className={cn(
            "flex-1 rounded-sm",
            v / max > 0.85 ? "bg-amber-500" : "bg-slate-200",
          )}
          initial={reduce ? { height: `${(v / max) * 100}%` } : { height: 0 }}
          whileInView={{ height: `${(v / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
